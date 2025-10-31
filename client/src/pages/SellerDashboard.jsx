import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Package, TrendingUp, DollarSign, Star, PlusCircle } from "lucide-react";
import { resolveImage, FALLBACK_IMG as FALLBACK } from "../lib/image";

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is a seller
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user || user.role !== 'seller') {
      // For demo, allow access but in production redirect to login
      console.warn('Seller access required');
    }

    // Fetch seller's products
    async function load() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data.slice(0, 3)); // Show first 3 for demo
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = [
    { title: "Total Sales", value: "$12,540", icon: <DollarSign className="text-green-500" /> },
    { title: "Products Listed", value: products.length.toString(), icon: <Package className="text-blue-500" /> },
    { title: "Monthly Growth", value: "+18.6%", icon: <TrendingUp className="text-purple-500" /> },
    { title: "Average Rating", value: "4.6 ★", icon: <Star className="text-yellow-500" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/')} className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-xl">
              Back to Home
            </Button>
            <Button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
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

        {/* Product List */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Products</h2>
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-slate-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition border-gray-100">
                    <img
                      src={resolveImage((p.images && p.images[0]) || FALLBACK)}
                      alt={p.name}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => navigate(`/product/${p._id}`)}
                    />
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-semibold text-gray-800 text-lg">{p.name}</h3>
                      <p className="text-indigo-600 font-bold">${p.price}</p>
                      <div className="text-sm text-gray-600">
                        Stock: <span className="font-medium text-gray-800">{p.stock || 0}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Sold: <span className="font-medium text-green-600">{p.sold || 0}</span>
                      </div>
                      <Button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700">Edit Product</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Performance Overview */}
        <section className="mt-10">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
            <p className="text-gray-600 mb-4">
              Your products are performing well this month with consistent growth in sales. Keep an eye on your stock
              levels and customer reviews to maintain momentum.
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white">View Analytics</Button>
          </Card>
        </section>
      </div>
    </div>
  );
}
