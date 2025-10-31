import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import { AuthProvider, useAuth } from './auth/AuthContext'
// Auth pages
import SellerLogin from './pages/SellerLogin'
import SellerRegister from './pages/SellerRegister'
import AdminLogin from './pages/AdminLogin'
import RegisterPage from './pages/login/register'
// import Auth from './pages/Auth' // legacy auth page (unused)
import Category from './pages/Category'
import Account from './pages/Account'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/auth" replace />
}

function RoleRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/auth" replace />
  return roles.includes(user.role) ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/seller" element={<PrivateRoute><SellerDashboard /></PrivateRoute>} />
          <Route path="/admin" element={<RoleRoute roles={["admin"]}><AdminDashboard /></RoleRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/order-tracking/:orderId?" element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
          
          {/* Auth Routes (unified) */}
          <Route path="/login" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth" element={<RegisterPage />} />
          <Route path="/unified-auth" element={<RegisterPage />} />
          
          {/* Category & Account */}
          <Route path="/categories" element={<Category />} />
          <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
          
          {/* Seller Routes */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
