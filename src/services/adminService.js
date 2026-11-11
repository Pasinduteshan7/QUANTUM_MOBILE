import api from './api';

export const adminService = {
  // ---- Admin Dashboard Stats & Stock Counters ----
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // ---- Products & Live Stock Counting ----
  getAllProducts: async (params) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },
  updateProductStock: async (id, { stock, delta }) => {
    const response = await api.put(`/admin/products/${id}/stock`, { stock, delta });
    return response.data;
  },
  createProduct: async (data) => {
    const response = await api.post('/admin/products', data);
    return response.data;
  },
  updateProduct: async (id, data) => {
    const response = await api.put(`/admin/products/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  // ---- Orders & Fulfillment ----
  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  // ---- Customer Communication Hub ----
  getChats: async () => {
    const response = await api.get('/admin/chats');
    return response.data;
  },
  getConversationMessages: async (conversationId) => {
    const response = await api.get(`/admin/chats/${conversationId}`);
    return response.data;
  },
  replyChat: async (data) => {
    const response = await api.post('/admin/chats/reply', data);
    return response.data;
  },

  // ---- Device Repairs & Workshop Hub ----
  getAllRepairs: async (params) => {
    const response = await api.get('/repairs', { params });
    return response.data;
  },
  updateRepairStatus: async (id, data) => {
    const response = await api.put(`/repairs/${id}/status`, data);
    return response.data;
  },
  deleteRepair: async (id) => {
    const response = await api.delete(`/repairs/${id}`);
    return response.data;
  },
  getOccupiedSlots: async (date) => {
    const response = await api.get('/repairs/slots', { params: { date } });
    return response.data;
  },

  // ---- In-Store POS & Walk-in Cashier Billing ----
  createPosSale: async (data) => {
    const response = await api.post('/pos/checkout', data);
    return response.data;
  },
  getPosSales: async () => {
    const response = await api.get('/pos/sales');
    return response.data;
  },
  getDailyPosSummary: async () => {
    const response = await api.get('/pos/daily-summary');
    return response.data;
  },

  // ---- Logistics & Courier Dispatch Board ----
  getLogisticsBoard: async () => {
    const response = await api.get('/logistics/board');
    return response.data;
  },
  updateParcel: async (id, data) => {
    const response = await api.patch(`/logistics/parcel/${id}`, data);
    return response.data;
  },

  // ---- Customers ----
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // ---- Super Admin (Store Owner) Controls ----
  getSuperAdminOverview: async () => {
    const response = await api.get('/super-admin/overview');
    return response.data;
  },
  getStaff: async () => {
    const response = await api.get('/super-admin/staff');
    return response.data;
  },
  createStaff: async (data) => {
    const response = await api.post('/super-admin/staff', data);
    return response.data;
  },
  toggleStaffStatus: async (id, isActive) => {
    const response = await api.put(`/super-admin/staff/${id}/status`, { isActive });
    return response.data;
  },
  deleteStaff: async (id) => {
    const response = await api.delete(`/super-admin/staff/${id}`);
    return response.data;
  },
  getAuditLogs: async (params) => {
    const response = await api.get('/super-admin/audit-logs', { params });
    return response.data;
  }
};
