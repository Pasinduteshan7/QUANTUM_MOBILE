import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
const CartContext = createContext(undefined);
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('quantum_cart');
                if (stored)
                    return JSON.parse(stored);
            }
            catch { }
        }
        return [
            {
                id: 'p1',
                productId: 'p1',
                name: 'iPhone 16 Pro',
                price: 425000,
                unitPrice: 425000,
                quantity: 1,
                image: '/iphone16pro.jpg',
                specs: '256GB • Black Titanium'
            }
        ];
    });
    const [selectedIds, setSelectedIds] = useState(() => cartItems.map(i => String(i.id)));
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('quantum_cart', JSON.stringify(cartItems));
        }
    }, [cartItems]);
    const addToCart = (product) => {
        setCartItems(prev => {
            const idx = prev.findIndex(item => String(item.id) === String(product.id));
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = { ...next[idx], quantity: (next[idx].quantity || 1) + 1 };
                return next;
            }
            return [...prev, { ...product, quantity: 1, unitPrice: product.price }];
        });
        setSelectedIds(prev => Array.from(new Set([...prev, String(product.id)])));
        toast.success(`Added ${product.name} to cart!`);
    };
    const updateQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setCartItems(prev => prev.map(item => String(item.id) === String(itemId) ? { ...item, quantity } : item));
    };
    const removeFromCart = (itemId) => {
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
    const clearCart = () => {
        setCartItems([]);
        setSelectedIds([]);
    };
    const totalCount = cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);
    const grandTotal = cartItems.reduce((acc, it) => acc + (it.unitPrice || it.price) * (it.quantity || 1), 0);
    const selectedItems = cartItems.filter(i => selectedIds.includes(String(i.id)));
    const selectedGrandTotal = selectedItems.reduce((acc, it) => acc + (it.unitPrice || it.price) * (it.quantity || 1), 0);
    return (<CartContext.Provider value={{
            cartItems,
            loading: false,
            totalCount,
            grandTotal,
            selectedIds,
            selectedItems,
            selectedGrandTotal,
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
        return { cartItems: [], totalCount: 0, grandTotal: 0, addToCart: () => { }, updateQuantity: () => { }, removeFromCart: () => { } };
    return ctx;
};
