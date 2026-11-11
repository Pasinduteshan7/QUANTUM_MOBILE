import api from './api';
import { MOCK_PRODUCTS } from '../lib/mockData';
export const productService = {
    getProducts: async (filters) => {
        try {
            const response = await api.get('/products', {
                params: filters
            });
            if (Array.isArray(response.data)) {
                return { products: response.data, total: response.data.length };
            }
            if (response.data?.data?.products) {
                return { 
                    products: response.data.data.products, 
                    total: response.data.data.pagination?.total ?? response.data.data.products.length 
                };
            }
            if (response.data?.products) {
                return { products: response.data.products, total: response.data.total ?? response.data.products.length };
            }
            return response.data;
        }
        catch (error) {
            // Graceful fallback to client-side filtering on mock products
            let result = [...MOCK_PRODUCTS];
            if (filters?.category && filters.category !== 'All' && filters.category !== 'all') {
                const catLower = filters.category.toLowerCase();
                result = result.filter((p) => p.category.toLowerCase() === catLower ||
                    p.subCategory?.toLowerCase().includes(catLower));
            }
            if (filters?.brand && filters.brand !== 'All') {
                result = result.filter((p) => p.brand.toLowerCase() === filters.brand.toLowerCase());
            }
            if (filters?.search) {
                const query = filters.search.toLowerCase();
                result = result.filter((p) => p.name.toLowerCase().includes(query) ||
                    p.brand.toLowerCase().includes(query) ||
                    p.specs?.toLowerCase().includes(query) ||
                    (p.itemCode && p.itemCode.toLowerCase().includes(query)));
            }
            if (filters?.minPrice !== undefined) {
                result = result.filter((p) => p.price >= filters.minPrice);
            }
            if (filters?.maxPrice !== undefined) {
                result = result.filter((p) => p.price <= filters.maxPrice);
            }
            if (filters?.sort) {
                if (filters.sort === 'price_asc')
                    result.sort((a, b) => a.price - b.price);
                if (filters.sort === 'price_desc')
                    result.sort((a, b) => b.price - a.price);
                if (filters.sort === 'rating')
                    result.sort((a, b) => (b.avgRating || b.rating || 0) - (a.avgRating || a.rating || 0));
            }
            return { products: result, total: result.length };
        }
    },
    getProductById: async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data?.data ?? response.data;
        }
        catch {
            const found = MOCK_PRODUCTS.find((p) => String(p.id) === String(id) || p.itemCode === String(id));
            return found || null;
        }
    }
};
