import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Button } from './ui/button'
import { ShoppingCart, Menu, X, Home as HomeIcon, LogOut, User } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated, isAdmin, isSeller } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              ShopEase
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
              Home
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
              Categories
            </Link>
            {isSeller && (
              <Link to="/seller" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                My Store
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/checkout')} 
              className="hidden sm:flex bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Cart
            </Button>
            
            {isAuthenticated ? (
              <>
                <Link to="/account" className="hidden sm:inline-block text-sm text-gray-700 hover:text-indigo-600 transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/auth')} 
                className="hidden sm:flex bg-slate-700 hover:bg-slate-800 text-white"
              >
                Login
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200 mt-4 pt-4 space-y-3">
            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Home
            </Link>
            <Link to="/categories" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Categories
            </Link>
            {isSeller && (
              <Link to="/seller" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                My Store
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                Admin
              </Link>
            )}
            {isAuthenticated && (
              <>
                <Link to="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <Button onClick={() => navigate('/auth')} className="w-full bg-slate-700 text-white">
                Login
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
