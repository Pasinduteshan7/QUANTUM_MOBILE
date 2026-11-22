import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);
const API_BASE = 'http://localhost:5000/api';

export const CartProvider = ({ children }) => {
    const { token, user, openAuthModal } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    // Fetch user's persistent cart directly from live MongoDB backend
    const fetchCart = useCallback(async () => {
        const storedToken = token || (typeof window !== 'undefined' ? localStorage.getItem('quantum_token') : null);
        if (!storedToken) {
            setCartItems([]);
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/cart`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });
            const data = await res.json();
            if (data.success && data.data?.items) {
                const mapped = data.data.items.map(it => ({
                    id: it._id,
                    backendItemId: it._id,
                    productId: it.product?._id || it.product || it._id,
                    name: it.name,
                    price: it.price,
                    unitPrice: it.price,
                    quantity: it.quantity,
                    image: it.image || it.selectedFinish?.image || '/hero_iphone18.jpg',
                    specs: it.selectedFinish?.name ? `Color: ${it.selectedFinish.name}` : 'Standard'
                }));
                setCartItems(mapped);
                setSelectedIds(mapped.map(m => String(m.id)));
            }
        } catch (err) {
            console.warn('Backend cart fetch failed:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (product) => {
        const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('quantum_token') : null);
        const storedUser = user || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('quantum_user') || 'null') : null);

        if (!activeToken || !storedUser || !activeToken.startsWith('ey')) {
            toast('Please sign in or create an account to add items to your cart.', {
                icon: '🔒',
                duration: 3500
            });
            openAuthModal(
                `Please sign in or create a customer account to add "${product.name}" to your cart and proceed to checkout.`,
                product
            );
            return false;
        }

        try {
            const res = await fetch(`${API_BASE}/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${activeToken}`
                },
                body: JSON.stringify({
                    productId: product.productId || product.id || 'p1',
                    customName: product.name || 'Device',
                    customPrice: product.price !== undefined ? product.price : (product.unitPrice || 0),
                    customImage: product.image || product.mainImage || '/hero_iphone18.jpg',
                    quantity: product.quantity || 1,
                    selectedFinish: {
                        name: product.finishName || product.specs || 'Standard',
                        image: product.image || product.mainImage || '/hero_iphone18.jpg'
                    }
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(`Added ${product.name} to cart! (Synced to MongoDB)`, { icon: '🛒' });
                await fetchCart();
                return true;
            } else {
                toast.error(data.message || 'Failed to add to cart');
                return false;
            }
        } catch (err) {
            console.error('Add to cart API error:', err);
            toast.error('Could not connect to database server.');
            return false;
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        const token = localStorage.getItem('quantum_token');
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        if (token) {
            try {
                const res = await fetch(`${API_BASE}/cart/item/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ quantity })
                });
                const data = await res.json();
                if (data.success) {
                    await fetchCart();
                    return;
                }
            } catch (err) {
                console.error('Update qty error:', err);
            }
        }

        setCartItems(prev => prev.map(item => String(item.id) === String(itemId) ? { ...item, quantity } : item));
    };

    const removeFromCart = async (itemId) => {
        const token = localStorage.getItem('quantum_token');
        if (token) {
            try {
                const res = await fetch(`${API_BASE}/cart/item/${itemId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    toast.success('Removed from cart & MongoDB', { icon: '🗑️' });
                    await fetchCart();
                    return;
                }
            } catch (err) {
                console.error('Delete item error:', err);
            }
        }

        setCartItems(prev => prev.filter(item => String(item.id) !== String(itemId)));
        setSelectedIds(prev => prev.filter(id => id !== String(itemId)));
        toast.success('Item removed from cart');
    };

    const toggleSelect = (itemId) => {
        const id = String(itemId);
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const selectAll = () => setSelectedIds(cartItems.map(i => String(i.id)));
    const deselectAll = () => setSelectedIds([]);
    const clearCart = async () => {
        const token = localStorage.getItem('quantum_token');
        if (token) {
            try {
                await fetch(`${API_BASE}/cart`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (e) {}
        }
        setCartItems([]);
        setSelectedIds([]);
    };

    const totalCount = cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);
    const grandTotal = cartItems.reduce((acc, it) => acc + (it.unitPrice || it.price) * (it.quantity || 1), 0);
    const formattedGrandTotal = `LKR ${grandTotal.toLocaleString()}`;
    const selectedItems = cartItems.filter(i => selectedIds.includes(String(i.id)));
    const selectedGrandTotal = selectedItems.reduce((acc, it) => acc + (it.unitPrice || it.price) * (it.quantity || 1), 0);

    return (<CartContext.Provider value={{
            cartItems,
            loading,
            totalCount,
            grandTotal,
            formattedGrandTotal,
            selectedIds,
            selectedItems,
            selectedGrandTotal,
            fetchCart,
            addToCart,
            updateQuantity,
            removeFromCart,
            toggleSelect,
            selectAll,
            deselectAll,
            clearCart
        }}>
      {children}
    </CartContext.Provider>);
};
export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx)
        return { cartItems: [], totalCount: 0, grandTotal: 0, formattedGrandTotal: 'LKR 0', addToCart: () => { }, updateQuantity: () => { }, removeFromCart: () => { } };
    return ctx;
};
