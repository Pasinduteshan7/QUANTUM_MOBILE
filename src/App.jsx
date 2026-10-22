import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

import HomePage from './pages/HomePage';
import PhonesPage from './pages/PhonesPage';
import PhoneDetailPage from './pages/PhoneDetailPage';
import AccessoriesPage from './pages/AccessoriesPage';
import RepairsHubPage from './pages/RepairsHubPage';
import RepairBookPage from './pages/RepairBookPage';
import RepairTrackPage from './pages/RepairTrackPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SuperAdminDashboardPage from './pages/SuperAdminDashboardPage';
import SearchPage from './pages/SearchPage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" />
        <Navbar />
        <main className="page-wrapper">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/phones" element={<PhonesPage />} />
            <Route path="/phones/:id" element={<PhoneDetailPage />} />
            <Route path="/accessories" element={<AccessoriesPage />} />
            <Route path="/repairs" element={<RepairsHubPage />} />
            <Route path="/repairs/book" element={<RepairBookPage />} />
            <Route path="/repairs/track" element={<RepairTrackPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/super-admin" element={<SuperAdminDashboardPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
      </CartProvider>
    </AuthProvider>
  );
}
