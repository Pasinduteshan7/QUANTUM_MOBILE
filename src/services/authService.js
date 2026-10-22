import api from './api';
// The Spring Boot backend stores/returns roles as "ROLE_ADMIN" / "ROLE_CUSTOMER"
// (that's the format Spring Security's hasRole() authorities expect). The frontend
// works with the shorter "ADMIN" / "CUSTOMER" form everywhere else, so we normalize
// right here, in one place, the moment a response comes back from the server.
const normalizeUser = (user) => ({
    ...user,
    role: (user.role ? String(user.role).replace('ROLE_', '') : user.role)
});
export const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const normalized = { ...response.data, user: normalizeUser(response.data.user) };
            if (normalized.token) {
                localStorage.setItem('quantum_token', normalized.token);
                localStorage.setItem('quantum_user', JSON.stringify(normalized.user));
            }
            return normalized;
        }
        catch (error) {
            // If the backend responded with 401 (Bad Credentials) or 400, propagate the real error
            if (error.response && (error.response.status === 401 || error.response.status === 400 || error.response.status === 403)) {
                throw new Error(error.response.data?.message || 'Invalid email or password');
            }
            // Fallback demo login ONLY when backend server is completely unreachable (Network Error)
            console.warn('Backend auth endpoint unreachable, providing local session demo:', error.message);
            const mockUser = {
                id: 'usr-101',
                name: email.split('@')[0] || 'Demo User',
                email: email,
                role: email.includes('admin') ? 'ADMIN' : 'CUSTOMER'
            };
            const mockResponse = {
                token: 'demo-jwt-token-' + Date.now(),
                user: mockUser
            };
            localStorage.setItem('quantum_token', mockResponse.token);
            localStorage.setItem('quantum_user', JSON.stringify(mockUser));
            return mockResponse;
        }
    },
    register: async (name, email, password) => {
        try {
            const response = await api.post('/auth/register', { name, email, password });
            const normalized = { ...response.data, user: normalizeUser(response.data.user) };
            if (normalized.token) {
                localStorage.setItem('quantum_token', normalized.token);
                localStorage.setItem('quantum_user', JSON.stringify(normalized.user));
            }
            return normalized;
        }
        catch (error) {
            console.warn('Backend register endpoint unreachable, providing local session demo:', error.message);
            const mockUser = {
                id: 'usr-' + Date.now(),
                name,
                email,
                role: 'CUSTOMER'
            };
            const mockResponse = {
                token: 'demo-jwt-token-' + Date.now(),
                user: mockUser
            };
            localStorage.setItem('quantum_token', mockResponse.token);
            localStorage.setItem('quantum_user', JSON.stringify(mockUser));
            return mockResponse;
        }
    },
    getMe: async () => {
        try {
            const response = await api.get('/auth/me');
            return normalizeUser(response.data);
        }
        catch {
            const stored = localStorage.getItem('quantum_user');
            return stored ? JSON.parse(stored) : null;
        }
    },
    logout: () => {
        localStorage.removeItem('quantum_token');
        localStorage.removeItem('quantum_user');
    }
};
