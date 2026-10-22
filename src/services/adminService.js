import api from './api';
// Every call in this file hits /api/admin/**, which the backend locks behind
// Spring Security's hasRole("ADMIN") check (see SecurityConfig.java). The JWT
// token is attached automatically by the axios interceptor in api.ts, so a
// non-admin token here simply gets a 403 back from the server.
export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
    // ---- Products ----
    getAllProducts: async () => {
        const response = await api.get('/admin/products');
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
        await api.delete(`/admin/products/${id}`);
    },
    // ---- Orders ----
    getAllOrders: async () => {
        const response = await api.get('/admin/orders');
        return response.data;
    },
    updateOrderStatus: async (id, status) => {
        const response = await api.put(`/admin/orders/${id}/status`, { status });
        return response.data;
    },
    // ---- Users ----
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    }
};
