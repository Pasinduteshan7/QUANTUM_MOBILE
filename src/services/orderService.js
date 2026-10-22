import api from './api';
export const orderService = {
    createOrder: async (data) => {
        try {
            const payload = {
                items: data.items,
                shippingAddress: data.shippingAddress,
                paymentMethod: data.paymentMethod,
                totalAmount: data.totalAmount
            };
            if (data.cartItemIds && data.cartItemIds.length > 0) {
                payload.cartItemIds = data.cartItemIds.map(Number).filter((n) => !isNaN(n));
            }
            // 📦 ORDER FLOW STEP 2: Axios fires the HTTP POST request over the network to port 8080.
            const response = await api.post('/orders', payload);
            return response.data;
        }
        catch {
            // Local fallback for offline/demo ordering
            const newOrder = {
                id: 'QC-ORD-' + Math.floor(100000 + Math.random() * 900000),
                items: data.items,
                shippingAddress: data.shippingAddress,
                paymentMethod: data.paymentMethod,
                totalAmount: data.totalAmount,
                status: 'PENDING',
                createdAt: new Date().toISOString()
            };
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('quantum_orders');
                const list = stored ? JSON.parse(stored) : [];
                list.unshift(newOrder);
                localStorage.setItem('quantum_orders', JSON.stringify(list));
            }
            return newOrder;
        }
    },
    getMyOrders: async () => {
        try {
            const response = await api.get('/orders');
            return response.data;
        }
        catch {
            if (typeof window === 'undefined')
                return [];
            const stored = localStorage.getItem('quantum_orders');
            return stored ? JSON.parse(stored) : [];
        }
    },
    getOrderById: async (id) => {
        try {
            const response = await api.get(`/orders/${id}`);
            return response.data;
        }
        catch {
            if (typeof window === 'undefined')
                return null;
            const stored = localStorage.getItem('quantum_orders');
            const list = stored ? JSON.parse(stored) : [];
            return list.find((o) => String(o.id) === String(id)) || null;
        }
    }
};
