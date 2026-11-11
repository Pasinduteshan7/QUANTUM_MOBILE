import Repair from '../models/Repair.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const STAGES_MAP = {
  'Received': 0,
  'Diagnosing': 1,
  'Repairing': 2,
  'Quality Tested': 3,
  'Ready': 4,
  'Delivered': 5,
  'Cancelled': -1
};

/**
 * @desc    Book a new device repair
 * @route   POST /api/repairs/book
 * @access  Public
 */
export const bookRepair = async (req, res, next) => {
  try {
    const {
      customerName,
      customerPhone,
      deviceBrand,
      deviceModel,
      issueId,
      issueLabel,
      serviceMode,
      appointmentDate,
      timeSlot,
      address,
      notes,
      estimatedCost
    } = req.body;

    if (!customerPhone || !deviceBrand || !deviceModel || !issueId || !appointmentDate) {
      return sendError(res, 400, 'Please provide customer phone, device brand & model, issue, and appointment date.');
    }

    // Check if slot is already occupied on that date for walk-in
    if (serviceMode === 'walkin' && timeSlot) {
      const existingSlot = await Repair.findOne({
        appointmentDate,
        timeSlot,
        serviceMode: 'walkin',
        status: { $nin: ['Delivered', 'Cancelled'] }
      });
      if (existingSlot) {
        return sendError(res, 409, `The time slot ${timeSlot} on ${appointmentDate} has already been reserved. Please choose another time slot.`);
      }
    }

    // Generate ticket ID e.g. REP-1085
    let ticketId;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      attempts++;
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      ticketId = `REP-${randomNum}`;
      const exists = await Repair.findOne({ ticketId });
      if (!exists) isUnique = true;
    }

    // Auto-generate realistic inward waybill number for Mail-in courier pickups
    const courierPartner = req.body.courierPartner || 'Domex';
    const waybillPrefix = courierPartner === 'Koombiyo' ? 'KMB' : courierPartner === 'Prompt Xpress' ? 'PRP' : courierPartner === 'Pronto' ? 'PRN' : 'DOM';
    const waybillNumber = serviceMode === 'mailin'
      ? `${waybillPrefix}-${Math.floor(100000 + Math.random() * 900000)}`
      : '';

    const newRepair = await Repair.create({
      ticketId,
      customerName: customerName || 'Valued Customer',
      customerPhone,
      deviceBrand,
      deviceModel,
      issueId,
      issueLabel: issueLabel || 'Hardware Diagnostic',
      serviceMode: serviceMode || 'walkin',
      appointmentDate,
      timeSlot: timeSlot || '10:15 AM',
      address: address || '',
      notes: notes || '',
      estimatedCost: estimatedCost || 'LKR 12,500 – 45,000',
      status: 'Received',
      currentStage: 0,
      diagnosticNotes: serviceMode === 'mailin'
        ? `Doorstep courier pickup scheduled with ${courierPartner}. Inward Waybill #${waybillNumber} issued. Rider will contact customer before pickup.`
        : `Device intake registered on ${new Date().toLocaleDateString('en-GB')}. Hardware diagnostic queued for ${timeSlot || 'assigned slot'}.`,
      courierPartner,
      waybillNumber,
      returnWaybillNumber: '',
      courierStage: 0, // 0: Pickup Scheduled
      courierNotes: serviceMode === 'mailin'
        ? `Doorstep pickup assigned to ${courierPartner}. Tamper-evident safe bag provided upon handover.`
        : ''
    });

    return sendSuccess(res, 201, 'Repair reservation successfully booked!', newRepair);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get occupied timeslots for a specific date
 * @route   GET /api/repairs/slots
 * @access  Public
 */
export const getOccupiedSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return sendError(res, 400, 'Please provide a date query parameter (YYYY-MM-DD).');
    }

    const occupiedRepairs = await Repair.find({
      appointmentDate: date,
      serviceMode: 'walkin',
      status: { $nin: ['Delivered', 'Cancelled'] }
    }).select('timeSlot ticketId customerName deviceModel status');

    const occupiedSlots = occupiedRepairs.map(r => r.timeSlot);

    return sendSuccess(res, 200, 'Occupied slots retrieved', {
      date,
      occupiedSlots,
      details: occupiedRepairs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Track repair by ticket ID or phone
 * @route   GET /api/repairs/track/:ticketId
 * @access  Public
 */
export const trackRepair = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const query = ticketId.trim();

    const repair = await Repair.findOne({
      $or: [
        { ticketId: { $regex: new RegExp(`^${query}$`, 'i') } },
        { customerPhone: { $regex: query, $options: 'i' } }
      ]
    });

    if (!repair) {
      return sendError(res, 404, `No active repair ticket found matching "${ticketId}".`);
    }

    return sendSuccess(res, 200, 'Repair ticket found', repair);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Customer approves or rejects frozen cost estimate
 * @route   PUT /api/repairs/track/:ticketId/approve
 * @access  Public
 */
export const approveEstimate = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { approved } = req.body;

    const repair = await Repair.findOne({ ticketId });
    if (!repair) {
      return sendError(res, 404, 'Repair ticket not found.');
    }

    repair.estimateApproved = approved;
    if (approved) {
      repair.status = 'Repairing';
      repair.currentStage = 2;
      repair.diagnosticNotes += ` | Cost estimate approved by customer. Parts allocation and technician assembly commenced.`;
    } else {
      repair.diagnosticNotes += ` | Estimate rejected by customer. Device prepared for collection without physical work.`;
    }

    await repair.save();
    return sendSuccess(res, 200, `Estimate successfully ${approved ? 'approved' : 'rejected'}.`, repair);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all repairs with full filtering & schedule analysis (Admin)
 * @route   GET /api/repairs
 * @access  Private (Admin / Super Admin)
 */
export const getAllRepairs = async (req, res, next) => {
  try {
    const { status, date, mode, brand, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (date) {
      filter.appointmentDate = date;
    }
    if (mode && mode !== 'all') {
      filter.serviceMode = mode;
    }
    if (brand && brand !== 'all') {
      filter.deviceBrand = brand;
    }
    if (search) {
      filter.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { deviceModel: { $regex: search, $options: 'i' } }
      ];
    }

    const repairs = await Repair.find(filter).sort({ createdAt: -1 });

    // Compute live dashboard metrics
    const allRepairs = await Repair.find();
    const todayStr = new Date().toISOString().split('T')[0];

    const stats = {
      total: allRepairs.length,
      received: allRepairs.filter(r => r.status === 'Received').length,
      diagnosing: allRepairs.filter(r => r.status === 'Diagnosing').length,
      repairing: allRepairs.filter(r => r.status === 'Repairing').length,
      qualityTested: allRepairs.filter(r => r.status === 'Quality Tested').length,
      ready: allRepairs.filter(r => r.status === 'Ready').length,
      delivered: allRepairs.filter(r => r.status === 'Delivered').length,
      todayAppointments: allRepairs.filter(r => r.appointmentDate === todayStr).length,
      walkinCount: allRepairs.filter(r => r.serviceMode === 'walkin').length,
      mailinCount: allRepairs.filter(r => r.serviceMode === 'mailin').length
    };

    return sendSuccess(res, 200, 'Repairs retrieved successfully', {
      repairs,
      stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update repair status, diagnostic notes or frozen estimate (Admin)
 * @route   PUT /api/repairs/:id/status
 * @access  Private (Admin / Super Admin)
 */
export const updateRepairStatus = async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const {
      status,
      diagnosticNotes,
      frozenCost,
      assignedTechnician,
      courierPartner,
      waybillNumber,
      returnWaybillNumber,
      courierStage,
      courierNotes
    } = req.body;

    const repair = await Repair.findById(id);
    if (!repair) {
      return sendError(res, 404, 'Repair ticket not found.');
    }

    if (courierPartner) repair.courierPartner = courierPartner;
    if (waybillNumber !== undefined) repair.waybillNumber = waybillNumber;
    if (returnWaybillNumber !== undefined) repair.returnWaybillNumber = returnWaybillNumber;
    if (courierNotes !== undefined) repair.courierNotes = courierNotes;

    // Handle courierStage updates (0 to 5)
    if (courierStage !== undefined) {
      repair.courierStage = Number(courierStage);
      if (repair.courierStage === 4) { // Return Courier Dispatched
        if (!repair.returnWaybillNumber) {
          const prefix = repair.courierPartner === 'Koombiyo' ? 'KMB' : repair.courierPartner === 'Prompt Xpress' ? 'PRP' : repair.courierPartner === 'Pronto' ? 'PRN' : 'DOM';
          repair.returnWaybillNumber = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
        }
        repair.status = 'Ready';
        repair.currentStage = 4;
      } else if (repair.courierStage === 5) {
        repair.status = 'Delivered';
        repair.currentStage = 5;
      } else if (repair.courierStage === 2) {
        repair.status = 'Diagnosing';
        repair.currentStage = 1;
      } else if (repair.courierStage === 3) {
        repair.status = 'Quality Tested';
        repair.currentStage = 3;
      }
    }

    if (status) {
      repair.status = status;
      repair.currentStage = STAGES_MAP[status] !== undefined ? STAGES_MAP[status] : repair.currentStage;

      // Sync courier stage if mail-in
      if (repair.serviceMode === 'mailin') {
        if (status === 'Ready' && repair.courierStage < 4) {
          repair.courierStage = 4;
          if (!repair.returnWaybillNumber) {
            const prefix = repair.courierPartner === 'Koombiyo' ? 'KMB' : repair.courierPartner === 'Prompt Xpress' ? 'PRP' : repair.courierPartner === 'Pronto' ? 'PRN' : 'DOM';
            repair.returnWaybillNumber = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
          }
        } else if (status === 'Delivered') {
          repair.courierStage = 5;
        } else if (status === 'Received' || status === 'Diagnosing') {
          if (repair.courierStage < 2) repair.courierStage = 2;
        } else if (status === 'Repairing' || status === 'Quality Tested') {
          if (repair.courierStage < 3) repair.courierStage = 3;
        }
      }
    }
    if (diagnosticNotes !== undefined) {
      repair.diagnosticNotes = diagnosticNotes;
    }
    if (frozenCost !== undefined) {
      repair.frozenCost = frozenCost;
    }
    if (assignedTechnician) {
      repair.assignedTechnician = assignedTechnician;
    }

    const updated = await repair.save();
    return sendSuccess(res, 200, `Repair ticket ${repair.ticketId} updated.`, updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete repair ticket (Admin)
 * @route   DELETE /api/repairs/:id
 * @access  Private (Admin / Super Admin)
 */
export const deleteRepair = async (req, res, next) => {
  try {
    const { id } = req.params;
    const repair = await Repair.findByIdAndDelete(id);
    if (!repair) {
      return sendError(res, 404, 'Repair ticket not found.');
    }
    return sendSuccess(res, 200, `Repair ticket ${repair.ticketId} deleted.`);
  } catch (error) {
    next(error);
  }
};
