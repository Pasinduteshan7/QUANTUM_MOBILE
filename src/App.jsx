import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';

import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import VerticalSidebar from './components/VerticalSidebar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import CustomerAuthModal from './components/CustomerAuthModal';

import HomePage from './pages/HomePage';
import PhoneDetailPage from './pages/PhoneDetailPage';
import AccessoriesPage from './pages/AccessoriesPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import RepairBookPage from './pages/RepairBookPage';
import RepairsHubPage from './pages/RepairsHubPage';
import RepairTrackPage from './pages/RepairTrackPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SuperAdminDashboardPage from './pages/SuperAdminDashboardPage';
import SearchPage from './pages/SearchPage';
import EcosystemPage from './pages/EcosystemPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function AppLayout() {
  const { collapsed } = useSidebar();
  const location = useLocation();

  // Detect whether the current route belongs to Admin or Super Admin
  const isAdminRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/super-admin') ||
    location.pathname.startsWith('/superadmin');

  // Dedicated full-width workspace for Admin Panels (Zero storefront clutter, dedicated scrollable workspace)
  if (isAdminRoute) {
    return (
      <div
        className="admin-layout-root"
        style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#f8fafc',
          overflow: 'hidden'
        }}
      >
        <AdminNavbar />
        <main
          id="admin-main-scroll-area"
          style={{
            flex: 1,
            width: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Routes>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/super-admin" element={<SuperAdminDashboardPage />} />
            <Route path="/superadmin" element={<Navigate to="/super-admin" replace />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    );
  }

  // Customer Storefront Layout (includes Storefront Navbar, Vertical Directory, Footer & Support Chat)
  return (
    <div className="store-layout-root">
      <Navbar />
      <VerticalSidebar />
      <div className={`store-content-area ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <main className="page-wrapper">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<CustomerLoginPage />} />
            <Route path="/customer/login" element={<CustomerLoginPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/ecosystem/:brand" element={<EcosystemPage />} />
            <Route path="/ecosystems" element={<Navigate to="/ecosystem/apple" replace />} />
            <Route path="/phones" element={<Navigate to="/ecosystem/apple" replace />} />
            <Route path="/phones/:id" element={<PhoneDetailPage />} />
            <Route path="/accessories" element={<AccessoriesPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/repairs" element={<RepairsHubPage />} />
            <Route path="/repairs/book" element={<RepairBookPage />} />
            <Route path="/repairs/track" element={<RepairTrackPage />} />
            <Route path="/search" element={<SearchPage />} />
            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ChatWidget />
      <CustomerAuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SidebarProvider>
          <Toaster position="top-right" />
          <AppLayout />
        </SidebarProvider>
      </CartProvider>
    </AuthProvider>
  );
}
