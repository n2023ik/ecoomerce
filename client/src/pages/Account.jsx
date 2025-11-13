import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { User, Mail, Shield, ArrowLeft, ShoppingBag, LayoutDashboard } from 'lucide-react'

export default function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  if (!user) return null

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-gray-900 text-white'
      case 'seller': return 'bg-purple-600 text-white'
      default: return 'bg-indigo-600 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors w-fit"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <User className="text-indigo-600" size={28} />
                My Account
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* User Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-semibold text-gray-800">{user.username}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="pt-4 border-t space-y-3">
                <Button
                  onClick={() => navigate('/order-tracking')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  View My Orders
                </Button>

                {(user.role === 'seller' || user.role === 'admin') && (
                  <Button
                    onClick={() => navigate(user.role === 'admin' ? '/admin' : '/seller')}
                    className={`w-full ${user.role === 'admin' ? 'bg-gray-900 hover:bg-black' : 'bg-purple-600 hover:bg-purple-700'} text-white flex items-center justify-center gap-2`}
                  >
                    <LayoutDashboard size={18} />
                    Go to {user.role === 'admin' ? 'Admin' : 'Seller'} Dashboard
                  </Button>
                )}

                <Button
                  onClick={handleLogout}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Account Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Loyalty Points</p>
                  <p className="text-2xl font-bold text-indigo-600">{user.loyaltyPoints || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-semibold text-gray-800">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">🎉 Welcome Back!</h3>
                <p className="text-sm text-indigo-100">
                  Continue shopping and earn more loyalty points with every purchase!
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="mt-4 w-full bg-white text-indigo-600 hover:bg-gray-100"
                >
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


