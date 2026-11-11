import Repair from '../models/Repair.js';
import Order from '../models/Order.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @desc    Get complete Logistics & Courier Dispatch Board
 * @route   GET /api/logistics/board
 * @access  Private (Admin / Logistics)
 */
export const getLogisticsBoard = async (req, res, next) => {
  try {
    // 1. Fetch Mail-in repairs (both inward pickups and outward returns)
    const mailinRepairs = await Repair.find({ serviceMode: 'mailin' })
      .sort({ updatedAt: -1 })
      .limit(100);

    // 2. Fetch Retail Orders
    const retailOrders = await Order.find()
      .populate('user', 'name phone email')
      .sort({ createdAt: -1 })
      .limit(100);

    // Split Hub consignments
    const techLabInward = mailinRepairs.filter(r => (r.courierStage ?? 0) <= 2);
    const techLabOutward = mailinRepairs.filter(r => (r.courierStage ?? 0) >= 3);

    // Courier metrics
    const courierBreakdown = {
      domex: mailinRepairs.filter(r => (r.courierPartner || 'Domex') === 'Domex').length,
      koombiyo: mailinRepairs.filter(r => r.courierPartner === 'Koombiyo').length,
      promptXpress: mailinRepairs.filter(r => r.courierPartner === 'Prompt Xpress').length,
      pronto: mailinRepairs.filter(r => r.courierPartner === 'Pronto').length
    };

    return sendSuccess(res, 200, 'Logistics board retrieved', {
      hubs: {
        retailWarehouse: {
          hubName: 'Main Retail Warehouse & Inward Hub',
          location: 'Ground Floor, 42 Galle Road, Colombo 03',
          ordersCount: retailOrders.length,
          orders: retailOrders
        },
        centralTechLab: {
          hubName: 'Central Diagnostic Lab & Repair Hub',
          location: 'Level 2 Service Wing, 42 Galle Road, Colombo 03',
          inwardCount: techLabInward.length,
          outwardCount: techLabOutward.length,
          inwardParcels: techLabInward,
          outwardParcels: techLabOutward
        }
      },
      courierBreakdown,
      totalParcelsInTransit: mailinRepairs.filter(r => [1, 4].includes(r.courierStage)).length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quick update parcel tracking details
 * @route   PATCH /api/logistics/parcel/:id
 * @access  Private (Admin / Logistics)
 */
export const updateParcel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, courierPartner, waybillNumber, returnWaybillNumber, courierStage, courierNotes } = req.body;

    if (type === 'repair' || !type) {
      const updated = await Repair.findByIdAndUpdate(
        id,
        {
          ...(courierPartner && { courierPartner }),
          ...(waybillNumber && { waybillNumber }),
          ...(returnWaybillNumber && { returnWaybillNumber }),
          ...(courierStage !== undefined && { courierStage: Number(courierStage) }),
          ...(courierNotes && { courierNotes })
        },
        { new: true }
      );
      return sendSuccess(res, 200, 'Repair parcel updated', updated);
    } else if (type === 'order') {
      const updated = await Order.findByIdAndUpdate(
        id,
        {
          ...(courierStage && { status: courierStage }),
          ...(courierNotes && { notes: courierNotes })
        },
        { new: true }
      );
      return sendSuccess(res, 200, 'Order parcel updated', updated);
    }

    return sendError(res, 400, 'Unknown parcel type');
  } catch (error) {
    next(error);
  }
};
