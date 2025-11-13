import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Users, DollarSign, Package, BarChart3, Settings, Shield, Check, X } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSales: 0,
    totalOrders: 0,
  });
  const [sellers, setSellers] = useState([]);
  const [loadingSellers, setLoadingSellers] = useState(false);

  useEffect(() => {
    // Check admin access
    // AuthContext stores cookie-based session; optional local fallback
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (user && user.role !== 'admin') {
      console.warn('Admin access required');
    }

    // Fetch admin stats
    async function loadStats() {
      try {
        // In production, fetch from /api/analytics
        setStats({ totalUsers: 5320, totalSales: 142870, totalOrders: 1245 });
      } catch (e) {
        console.error(e);
      }
    }
    loadStats();
    loadSellers();
  }, []);

  async function loadSellers() {
    setLoadingSellers(true);
    try {
      const res = await fetch('/api/sellers', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch sellers');
      const data = await res.json();
      setSellers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSellers(false);
    }
  }

  async function approveSeller(id) {
    try {
      const res = await fetch(`/api/sellers/${id}/approve`, { method: 'PATCH', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to approve');
      await loadSellers();
    } catch (e) {
      console.error(e);
      alert('Could not approve seller');
    }
  }

  async function blockSeller(id) {
    try {
      const res = await fetch(`/api/sellers/${id}/block`, { method: 'PATCH', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to block');
      await loadSellers();
    } catch (e) {
      console.error(e);
      alert('Could not block seller');
    }
  }

  const dashboardStats = [
    { title: "Total Users", value: stats.totalUsers.toLocaleString(), icon: <Users className="text-indigo-500" /> },
    { title: "Total Sales", value: `$${stats.totalSales.toLocaleString()}`, icon: <DollarSign className="text-green-500" /> },
    { title: "Orders This Month", value: stats.totalOrders.toLocaleString(), icon: <Package className="text-blue-500" /> },
    { title: "System Health", value: "Stable", icon: <Shield className="text-emerald-500" /> },
  ];

  const recentSellers = [
    { name: "Amit Kumar", email: "amit@store.com", sales: "$1,200", joined: "2 weeks ago" },
    { name: "Priya Verma", email: "priya@shopnow.com", sales: "$980", joined: "1 month ago" },
    { name: "Rahul Singh", email: "rahul@techmart.com", sales: "$2,450", joined: "3 months ago" },
  ];

  const systemLogs = [
    { id: 1, activity: "New user registered", time: "2 hours ago" },
    { id: 2, activity: "Seller Priya updated product inventory", time: "5 hours ago" },
    { id: 3, activity: "System backup completed", time: "Yesterday" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/')} className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-xl">
              Back to Home
            </Button>
            <Button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl">
              <Settings className="mr-2 h-4 w-4" /> Manage Settings
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, i) => (
            <Card key={i} className="hover:shadow-md transition-all">
              <CardHeader className="flex justify-between items-center pb-2">
                <CardTitle className="text-gray-600 text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Seller Verification */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Seller Verification</h2>
          <Card>
            <CardHeader>
              <CardTitle>Pending Sellers</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSellers ? (
                <p className="text-gray-500">Loading sellers...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-600">
                        <th className="py-2 px-3">Store</th>
                        <th className="py-2 px-3">Owner</th>
                        <th className="py-2 px-3">Email</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellers.filter(s => s.status !== 'approved').map(s => (
                        <tr key={s._id} className="border-t">
                          <td className="py-2 px-3 font-medium">{s.storeName}</td>
                          <td className="py-2 px-3">{s.userId?.username || '-'}</td>
                          <td className="py-2 px-3">{s.userId?.email || s.businessEmail || '-'}</td>
                          <td className="py-2 px-3">{s.status}</td>
                          <td className="py-2 px-3">
                            <div className="flex justify-end gap-2">
                              <Button onClick={() => approveSeller(s._id)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <Check className="h-4 w-4 mr-1"/> Approve
                              </Button>
                              <Button onClick={() => blockSeller(s._id)} className="bg-rose-600 hover:bg-rose-700 text-white" variant="destructive">
                                <X className="h-4 w-4 mr-1"/> Block
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {sellers.filter(s => s.status !== 'approved').length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-500">No pending sellers</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* System Logs */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">System Activity Logs</h2>
          <Card className="overflow-hidden">
            <CardContent className="divide-y divide-gray-100">
              {systemLogs.map((log) => (
                <div key={log.id} className="flex justify-between items-center py-3 text-gray-700">
                  <span>{log.activity}</span>
                  <span className="text-sm text-gray-500">{log.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Reports */}
        <section className="mt-10">
          <Card className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Monthly Performance Report</h2>
                <p className="text-indigo-100 max-w-md">
                  Get a detailed view of sales trends, seller performance, and customer engagement over the last 30 days.
                </p>
              </div>
              <Button className="bg-white text-indigo-700 hover:bg-gray-100">
                <BarChart3 className="mr-2 h-4 w-4" /> View Report
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
