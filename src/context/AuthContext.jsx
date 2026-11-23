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

    // Google Sign-In / OAuth 2.0
    const googleLogin = async (payload) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success && data.data?.token) {
                setUser(data.data);
                setToken(data.data.token);
                localStorage.setItem('quantum_user', JSON.stringify(data.data));
                localStorage.setItem('quantum_token', data.data.token);
                return data.data;
            } else {
                throw new Error(data.message || 'Google sign-in failed.');
            }
        } catch (err) {
            console.error('Google login error:', err);
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('quantum_user');
            localStorage.removeItem('quantum_token');
            // Clean chat sessions so subsequent guests/users start with zero leftover history
            localStorage.removeItem('quantum_chat_session');
            sessionStorage.removeItem('quantum_guest_chat');
            window.dispatchEvent(new CustomEvent('quantum-auth-logout'));
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

    // Instant 1-Click Fast Login for Developers & Administrators (Zero password typing)
    const quickLoginAs = async (targetRole) => {
        let creds = { email: 'admin@quick.lk', password: 'password123' };
        if (targetRole === 'super_admin' || targetRole === 'owner') {
            creds = { email: 'owner@quick.lk', password: 'password123' };
        } else if (targetRole === 'admin' || targetRole === 'store') {
            creds = { email: 'admin@quick.lk', password: 'password123' };
        } else if (targetRole === 'customer' || targetRole === 'kasun') {
            creds = { email: 'kasun@gmail.com', password: 'password123' };
        } else if (targetRole === 'pasindu') {
            creds = { email: 'pasinduteshan007@gmail.com', password: 'password123' };
        }
        return await login(creds.email, creds.password);
    };

    const roleStr = String(user?.role || '').toLowerCase();
    const isCustomer = roleStr === 'customer' || roleStr === 'role_customer';
    const isAdmin = [
        'admin',
        'super_admin',
        'store_admin',
        'tech_admin',
        'cashier_admin',
        'logistics_admin',
        'role_admin',
        'role_super_admin',
        'technician'
    ].includes(roleStr) || roleStr.includes('admin');
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
            googleLogin,
            register,
            logout,
            forgotPassword,
            resetPassword,
            isAuthModalOpen,
            authModalReason,
            pendingCartItem,
            openAuthModal,
            closeAuthModal,
            clearPendingCartItem,
            quickLoginAs
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
            quickLoginAs: async () => {},
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
