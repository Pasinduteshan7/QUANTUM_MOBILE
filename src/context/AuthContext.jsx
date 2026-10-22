import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const initAuth = () => {
            if (typeof window !== 'undefined') {
                try {
                    const storedToken = localStorage.getItem('quantum_token');
                    const storedUser = localStorage.getItem('quantum_user');
                    if (storedToken && storedUser) {
                        setToken(storedToken);
                        setUser(JSON.parse(storedUser));
                    }
                    else {
                        const demoUser = {
                            id: 'usr-101',
                            name: 'Kasun Mendis',
                            email: 'kasun@gmail.com',
                            role: 'CUSTOMER'
                        };
                        setUser(demoUser);
                        setToken('demo-token-customer');
                        localStorage.setItem('quantum_user', JSON.stringify(demoUser));
                        localStorage.setItem('quantum_token', 'demo-token-customer');
                    }
                }
                catch (e) {
                    console.error('Auth init error:', e);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);
    const loginAs = (role) => {
        let mockUser;
        if (role === 'SUPER_ADMIN') {
            mockUser = { id: 'usr-super', name: 'Teshan G.H.P (Super Admin)', email: 'teshan@quantum.lk', role: 'SUPER_ADMIN' };
        }
        else if (role === 'ADMIN') {
            mockUser = { id: 'usr-admin-1', name: 'Kamal Perera (Store Manager)', email: 'kamal@quantum.lk', role: 'ADMIN' };
        }
        else {
            mockUser = { id: 'usr-101', name: 'Kasun Mendis', email: 'kasun@gmail.com', role: 'CUSTOMER' };
        }
        const token = 'demo-token-' + role.toLowerCase();
        setUser(mockUser);
        setToken(token);
        if (typeof window !== 'undefined') {
            localStorage.setItem('quantum_user', JSON.stringify(mockUser));
            localStorage.setItem('quantum_token', token);
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
    const roleStr = String(user?.role || '').toUpperCase();
    const isAdmin = roleStr === 'ADMIN' || roleStr === 'ROLE_ADMIN' || roleStr === 'SUPER_ADMIN' || roleStr === 'ROLE_SUPER_ADMIN';
    const isSuperAdmin = roleStr === 'SUPER_ADMIN' || roleStr === 'ROLE_SUPER_ADMIN';
    return (<AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user,
            isAdmin,
            isSuperAdmin,
            loading,
            loginAs,
            logout
        }}>
      {children}
    </AuthContext.Provider>);
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx)
        return { user: null, isAuthenticated: false, isAdmin: false, isSuperAdmin: false, loginAs: () => { }, logout: () => { } };
    return ctx;
};
