import PosSale from '../models/PosSale.js';
import Product from '../models/Product.js';
import Repair from '../models/Repair.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { emitBulkStockUpdated, emitRepairUpdated, emitPosSaleCompleted } from '../socket.js';

/**
 * @desc    Process a new Walk-in Counter Sale (POS Checkout)
 * @route   POST /api/pos/checkout
 * @access  Private (Admin / Cashier)
 */
export const createPosSale = async (req, res, next) => {
  try {
    const {
      items = [],
      repairTicket = null,
      subtotal = 0,
      discount = 0,
      netTotal = 0,
      paymentMethod = 'Cash',
      amountPaid = 0,
      customerName = 'Walk-in Counter Customer',
      customerPhone = '',
      cashierName = 'Nimal Jayawardena (Counter 01)',
      receiptNotes
    } = req.body;

    if ((!items || items.length === 0) && (!repairTicket || !repairTicket.ticketId)) {
      return sendError(res, 400, 'Cannot complete empty transaction. Add at least one product or repair ticket.');
    }

    if (amountPaid < netTotal && paymentMethod === 'Cash') {
      return sendError(res, 400, `Amount paid (LKR ${amountPaid}) cannot be less than Net Total (LKR ${netTotal}) for Cash payments.`);
    }

    // 1. Decrement inventory in real-time in MongoDB
    for (const it of items) {
      if (it.productId) {
        await Product.findByIdAndUpdate(it.productId, {
          $inc: { stock: -Math.abs(Number(it.quantity) || 1) }
        });
      }
    }

    // 2. If repair ticket is attached, mark as Delivered & Payment Settled
    if (repairTicket && (repairTicket.repairId || repairTicket.ticketId)) {
      const query = repairTicket.repairId ? { _id: repairTicket.repairId } : { ticketId: repairTicket.ticketId };
      await Repair.findOneAndUpdate(query, {
        status: 'Delivered',
        courierStage: 5,
        diagnosticNotes: `${repairTicket.deviceModel || 'Device'} handed over to customer at Galle Rd Counter. Payment of LKR ${repairTicket.repairAmount} settled with Cashier.`
      });
    }

    // 3. Generate unique POS Sale Number
    const saleNumber = `POS-${Math.floor(10000 + Math.random() * 90000)}`;
    const changeGiven = paymentMethod === 'Cash' ? Math.max(0, amountPaid - netTotal) : 0;

    const newSale = await PosSale.create({
      saleNumber,
      cashierName: req.user?.name || cashierName,
      cashierId: req.user?._id,
      branch: 'Colombo 03 Flagship Store (42 Galle Road)',
      customerName,
      customerPhone,
      items: items.map(it => ({
        productId: it.productId,
        name: it.name,
        brand: it.brand || 'Quantum',
        category: it.category || 'Retail',
        price: Number(it.price) || 0,
        quantity: Number(it.quantity) || 1,
        lineTotal: (Number(it.price) || 0) * (Number(it.quantity) || 1),
        image: it.image || ''
      })),
      repairTicket: repairTicket ? {
        ticketId: repairTicket.ticketId,
        repairId: repairTicket.repairId,
        deviceModel: repairTicket.deviceModel,
        issueLabel: repairTicket.issueLabel,
        repairAmount: Number(repairTicket.repairAmount) || 0
      } : undefined,
      subtotal: Number(subtotal) || Number(netTotal),
      discount: Number(discount) || 0,
      netTotal: Number(netTotal),
      paymentMethod,
      amountPaid: Number(amountPaid) || Number(netTotal),
      changeGiven,
      status: 'Completed',
      receiptNotes: receiptNotes || '6-Month Comprehensive In-Store Warranty Included. Serial/IMEI logged.'
    });

    // Real-time broadcast for stock auto-deduction, POS counter sale, and repair pickup across all tabs
    emitBulkStockUpdated(items);
    emitPosSaleCompleted(newSale);
    if (repairTicket) {
      emitRepairUpdated({ ticketId: repairTicket.ticketId, status: 'Delivered', courierStage: 5 });
    }

    return sendSuccess(res, 201, `Counter Sale #${saleNumber} completed successfully!`, newSale);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all POS counter sales
 * @route   GET /api/pos/sales
 * @access  Private (Admin / Cashier)
 */
export const getPosSales = async (req, res, next) => {
  try {
    const sales = await PosSale.find().sort({ createdAt: -1 }).limit(100);
    return sendSuccess(res, 200, 'POS sales retrieved', sales);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Daily POS Cash Drawer Summary
 * @route   GET /api/pos/daily-summary
 * @access  Private (Admin / Cashier)
 */
export const getDailyPosSummary = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todaySales = await PosSale.find({ createdAt: { $gte: startOfDay } });

    const totalSalesAmount = todaySales.reduce((acc, s) => acc + (s.netTotal || 0), 0);
    const cashTotal = todaySales.filter(s => s.paymentMethod === 'Cash').reduce((acc, s) => acc + (s.netTotal || 0), 0);
    const cardTotal = todaySales.filter(s => s.paymentMethod === 'Card').reduce((acc, s) => acc + (s.netTotal || 0), 0);
    const otherTotal = todaySales.filter(s => !['Cash', 'Card'].includes(s.paymentMethod)).reduce((acc, s) => acc + (s.netTotal || 0), 0);

    return sendSuccess(res, 200, 'Daily POS summary retrieved', {
      transactionCount: todaySales.length,
      totalSalesAmount,
      cashTotal,
      cardTotal,
      otherTotal,
      openingFloat: 25000, // LKR 25,000 standard opening float
      totalCashInDrawer: 25000 + cashTotal
    });
  } catch (error) {
    next(error);
  }
};
