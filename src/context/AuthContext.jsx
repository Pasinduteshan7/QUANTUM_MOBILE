import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Customer Auth Modal State (e.g. when guest tries to add to cart)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalReason, setAuthModalReason] = useState('');
    const [pendingCartItem, setPendingCartItem] = useState(null);

    useEffect(() => {
        const initAuth = () => {
            if (typeof window !== 'undefined') {
                try {
                    const storedToken = localStorage.getItem('quantum_token');
                    const storedUser = localStorage.getItem('quantum_user');
                    if (storedToken && storedUser && storedToken.startsWith('ey')) {
                        setToken(storedToken);
                        setUser(JSON.parse(storedUser));
                    } else {
                        // Clean guest state - do NOT auto-login as any user
                        setUser(null);
                        setToken(null);
                    }
                } catch (e) {
                    console.error('Auth init error:', e);
                    setUser(null);
                    setToken(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    // Regular Login (Customer or Admin)
    const login = async (email, password) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success && data.data?.token) {
                setUser(data.data);
                setToken(data.data.token);
                localStorage.setItem('quantum_user', JSON.stringify(data.data));
                localStorage.setItem('quantum_token', data.data.token);
                return data.data;
            } else {
                throw new Error(data.message || 'Login failed. Please check credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    };

    // Customer Registration
    const register = async ({ name, email, password, phone, shippingAddress }) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phone, shippingAddress })
            });
            const data = await res.json();
            if (data.success && data.data?.token) {
                setUser(data.data);
                setToken(data.data.token);
                localStorage.setItem('quantum_user', JSON.stringify(data.data));
                localStorage.setItem('quantum_token', data.data.token);
                return data.data;
            } else {
                throw new Error(data.message || 'Registration failed.');
            }
        } catch (err) {
            console.error('Register error:', err);
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('quantum_user');
            localStorage.removeItem('quantum_token');
        }
    };

    // Forgot Password Request
    const forgotPassword = async (email) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.success) {
                return data;
            } else {
                throw new Error(data.message || 'Failed to dispatch reset email.');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            throw err;
        }
    };

    // Reset Password with Token
    const resetPassword = async (token, password) => {
        try {
            const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (data.success && data.data?.token) {
                setUser(data.data);
                setToken(data.data.token);
                localStorage.setItem('quantum_user', JSON.stringify(data.data));
                localStorage.setItem('quantum_token', data.data.token);
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to reset password.');
            }
        } catch (err) {
            console.error('Reset password error:', err);
            throw err;
        }
    };

    const openAuthModal = (reason = '', pendingItem = null) => {
        setAuthModalReason(reason);
        if (pendingItem) {
            setPendingCartItem(pendingItem);
        }
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
        setAuthModalReason('');
    };

    const clearPendingCartItem = () => {
        setPendingCartItem(null);
    };

    const roleStr = String(user?.role || '').toLowerCase();
    const isCustomer = roleStr === 'customer' || roleStr === 'role_customer';
    const isAdmin = roleStr === 'admin' || roleStr === 'super_admin' || roleStr === 'role_admin' || roleStr === 'role_super_admin';
    const isSuperAdmin = roleStr === 'super_admin' || roleStr === 'role_super_admin';

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user,
            isCustomer,
            isAdmin,
            isSuperAdmin,
            loading,
            login,
            register,
            logout,
            forgotPassword,
            resetPassword,
            isAuthModalOpen,
            authModalReason,
            pendingCartItem,
            openAuthModal,
            closeAuthModal,
            clearPendingCartItem
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        return {
            user: null,
            token: null,
            isAuthenticated: false,
            isCustomer: false,
            isAdmin: false,
            isSuperAdmin: false,
            loading: false,
            login: async () => {},
            register: async () => {},
            logout: () => {},
            isAuthModalOpen: false,
            authModalReason: '',
            pendingCartItem: null,
            openAuthModal: () => {},
            closeAuthModal: () => {},
            clearPendingCartItem: () => {}
        };
    }
    return ctx;
};
