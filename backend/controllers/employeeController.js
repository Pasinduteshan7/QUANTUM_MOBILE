import Employee from '../models/Employee.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @desc    Get all employees with filters and payroll summary
 * @route   GET /api/super-admin/employees
 * @access  Private / Super Admin
 */
export const getAllEmployees = async (req, res, next) => {
  try {
    const { department, designation, status, search } = req.query;
    const query = {};

    if (department && department !== 'ALL') {
      query.department = department;
    }
    if (designation && designation !== 'ALL') {
      query.designation = designation;
    }
    if (status && status !== 'ALL') {
      query.employmentStatus = status;
    }
    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { nic: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { 'residentialAddress.city': { $regex: q, $options: 'i' } },
        { 'bankDetails.bankName': { $regex: q, $options: 'i' } }
      ];
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });

    // Compute workforce & payroll metrics
    const allEmployees = await Employee.find();
    const totalStaff = allEmployees.length;
    const activeStaff = allEmployees.filter(e => e.employmentStatus === 'ACTIVE').length;
    const totalMonthlyPayroll = allEmployees
      .filter(e => e.employmentStatus === 'ACTIVE')
      .reduce((sum, e) => sum + (e.payroll?.basicSalaryLKR || 0) + (e.payroll?.allowancesLKR || 0), 0);

    return sendSuccess(res, 200, 'Employees retrieved successfully', {
      employees,
      stats: {
        totalStaff,
        activeStaff,
        onLeaveStaff: allEmployees.filter(e => e.employmentStatus === 'ON_LEAVE').length,
        totalMonthlyPayroll
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single employee details
 * @route   GET /api/super-admin/employees/:id
 * @access  Private / Super Admin
 */
export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return sendError(res, 404, 'Employee not found');
    }
    return sendSuccess(res, 200, 'Employee profile loaded', employee);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new employee record (HR & Payroll)
 * @route   POST /api/super-admin/employees
 * @access  Private / Super Admin
 */
export const createEmployee = async (req, res, next) => {
  try {
    const {
      fullName,
      nic,
      phone,
      email,
      residentialAddress,
      designation,
      department,
      associatedAdminRole,
      bankDetails,
      payroll,
      employmentStatus,
      dateOfJoining,
      emergencyContact
    } = req.body;

    if (!fullName || !nic || !phone || !designation || !department) {
      return sendError(res, 400, 'Full name, NIC, phone, designation, and department are mandatory.');
    }

    if (!bankDetails?.bankName || !bankDetails?.accountNumber || !bankDetails?.accountHolderName || !bankDetails?.branchName) {
      return sendError(res, 400, 'Complete bank account details (Bank, Account Number, Holder Name, Branch) are required.');
    }

    const existing = await Employee.findOne({ nic: nic.toUpperCase().trim() });
    if (existing) {
      return sendError(res, 400, `An employee with NIC '${nic.toUpperCase().trim()}' is already registered.`);
    }

    const newEmployee = await Employee.create({
      fullName: fullName.trim(),
      nic: nic.toUpperCase().trim(),
      phone: phone.trim(),
      email: (email || '').toLowerCase().trim(),
      residentialAddress: {
        street: residentialAddress?.street || 'Galle Road',
        city: residentialAddress?.city || 'Colombo',
        district: residentialAddress?.district || 'Colombo',
        postalCode: residentialAddress?.postalCode || ''
      },
      designation,
      department,
      associatedAdminRole: associatedAdminRole || 'none',
      bankDetails: {
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber.trim(),
        accountHolderName: bankDetails.accountHolderName.trim(),
        branchName: bankDetails.branchName.trim(),
        branchCode: bankDetails.branchCode || ''
      },
      payroll: {
        basicSalaryLKR: Number(payroll?.basicSalaryLKR || 50000),
        allowancesLKR: Number(payroll?.allowancesLKR || 0),
        epfNumber: payroll?.epfNumber || ''
      },
      employmentStatus: employmentStatus || 'ACTIVE',
      dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : new Date(),
      emergencyContact: emergencyContact || { name: '', relationship: 'Family', phone: '' }
    });

    // Record in Security Audit Log
    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Super Admin',
      userRole: 'super_admin',
      action: 'EMPLOYEE_HIRED',
      target: `${newEmployee.fullName} (${newEmployee.designation})`,
      details: {
        employeeId: newEmployee._id,
        nic: newEmployee.nic,
        department: newEmployee.department,
        bank: newEmployee.bankDetails.bankName
      },
      level: 'success',
      ip: req.ip
    });

    return sendSuccess(res, 201, 'Employee profile successfully registered', newEmployee);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update employee profile & payroll
 * @route   PUT /api/super-admin/employees/:id
 * @access  Private / Super Admin
 */
export const updateEmployee = async (req, res, next) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return sendError(res, 404, 'Employee record not found');
    }

    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Super Admin',
      userRole: 'super_admin',
      action: 'EMPLOYEE_UPDATED',
      target: `${updated.fullName} (${updated.designation})`,
      details: {
        employeeId: updated._id,
        updatedFields: Object.keys(req.body)
      },
      level: 'info',
      ip: req.ip
    });

    return sendSuccess(res, 200, 'Employee record updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update employee employment status
 * @route   PUT /api/super-admin/employees/:id/status
 * @access  Private / Super Admin
 */
export const updateEmployeeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return sendError(res, 400, 'Employment status is required.');
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return sendError(res, 404, 'Employee not found');
    }

    const previousStatus = employee.employmentStatus;
    employee.employmentStatus = status;
    await employee.save();

    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Super Admin',
      userRole: 'super_admin',
      action: 'EMPLOYEE_STATUS_CHANGED',
      target: `${employee.fullName} (${previousStatus} -> ${status})`,
      details: { employeeId: employee._id, oldStatus: previousStatus, newStatus: status },
      level: 'warning',
      ip: req.ip
    });

    return sendSuccess(res, 200, `Employee status updated to ${status}`, employee);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete employee record
 * @route   DELETE /api/super-admin/employees/:id
 * @access  Private / Super Admin
 */
export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return sendError(res, 404, 'Employee not found');
    }

    await Employee.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Super Admin',
      userRole: 'super_admin',
      action: 'EMPLOYEE_REMOVED',
      target: `${employee.fullName} (NIC: ${employee.nic})`,
      details: { employeeId: employee._id, designation: employee.designation },
      level: 'danger',
      ip: req.ip
    });

    return sendSuccess(res, 200, `Employee record for ${employee.fullName} deleted`);
  } catch (error) {
    next(error);
  }
};

