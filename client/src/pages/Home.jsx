import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { resolveImage, FALLBACK_IMG as FALLBACK } from "../lib/image";
import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  Shirt,
  Watch,
  Headphones,
  ShoppingBag,
  Sparkles,
  Star,
  ArrowRight,
} from "lucide-react";

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop';

const stats = [
  { title: "Total Revenue", value: "$45,231.89", icon: <DollarSign className="h-4 w-4 text-indigo-500" />, change: "+20.1% from last month" },
  { title: "New Customers", value: "+2,350", icon: <Users className="h-4 w-4 text-indigo-500" />, change: "+180.1%" },
  { title: "Weekly Sales", value: "+12,234", icon: <ShoppingCart className="h-4 w-4 text-indigo-500" />, change: "+19%" },
  { title: "Orders Pending", value: "27", icon: <Package className="h-4 w-4 text-indigo-500" />, change: "+2 since last hour" },
];

const categories = [
  { name: "Electronics", icon: <Headphones size={28} />, color: "bg-blue-50 text-blue-600" },
  { name: "Apparel", icon: <Shirt size={28} />, color: "bg-rose-50 text-rose-600" },
  { name: "Bags", icon: <ShoppingBag size={28} />, color: "bg-amber-50 text-amber-600" },
  { name: "Watches", icon: <Watch size={28} />, color: "bg-violet-50 text-violet-600" },
  { name: "Accessories", icon: <Sparkles size={28} />, color: "bg-emerald-50 text-emerald-600" },
  { name: "Footwear", icon: <Package size={28} />, color: "bg-slate-50 text-slate-600" },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        if (!cancelled) {
          const sorted = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.sold || 0) - (a.sold || 0));
          setProducts(sorted);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const newArrivals = products.slice(0, 4);
  const trendingProducts = products.slice(0, 2);

  function handleAddToCart(p) {
    try {
      if (!user) {
        alert('Please login to add items to cart');
  navigate('/auth');
        return;
      }
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const idx = cart.findIndex((i) => i.productId === p._id);
      if (idx >= 0) cart[idx].qty += 1;
      else cart.push({ productId: p._id, name: p.name, price: p.price, qty: 1, image: (p.images && p.images[0]) || FALLBACK_IMG });
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Added to cart!');
    } catch {
      alert('Could not add to cart');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">ShopEase</h2>
          <div className="flex gap-3 items-center">
            <Button onClick={() => navigate('/checkout')} className="bg-green-600 hover:bg-green-700 text-white">
              🛒 Checkout
            </Button>
            
            {user ? (
              <>
                <Link to="/account" className="text-sm text-gray-700">Hi, {user.username}</Link>
                <Button onClick={logout} className="bg-gray-800 hover:bg-gray-900 text-white">Logout</Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate('/auth')} className="bg-slate-700 hover:bg-slate-800 text-white">Login/Register</Button>
              </>
            )}
          </div>
        </nav>

        {/* Hero Banner */}
        <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-10 shadow-xl">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-3">Discover Deals You'll Love</h1>
            <p className="text-indigo-100 max-w-md">
              Save up to 60% on top electronics, fashion, and accessories. Limited time only.
            </p>
            <Button className="mt-6 bg-white text-indigo-600 font-semibold hover:bg-slate-100 transition-colors group">
              Shop Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1612831818834-0d4b0f090264?q=80&w=1000&auto=format&fit=crop"
              alt="Sale Banner"
              className="w-80 h-80 object-cover rounded-full"
            />
          </div>
        </section>

        {/* Stats Section */}
        <motion.section
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all duration-200 border-indigo-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        <div className="grid lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2 space-y-10">
            {/* New Arrivals */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">New Arrivals</h2>
              {loading ? (
                <div className="flex space-x-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-64 h-60 bg-slate-200 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4">
                  {newArrivals.map((p, i) => (
                    <motion.div
                      key={p._id}
                      className="flex-shrink-0 w-64 cursor-pointer"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      onClick={() => navigate(`/product/${p._id}`)}
                    >
                      <Card className="overflow-hidden group hover:shadow-xl transition duration-300">
                        <img
                          src={resolveImage((p.images && p.images[0]) || FALLBACK)}
                          alt={p.name}
                          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-800 truncate">{p.name}</h3>
                          <p className="text-indigo-600 font-bold mt-1">${p.price}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            

            {/* Trending Products */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Trending Products</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {loading ? (
                  <>
                    <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
                  </>
                ) : (
                  trendingProducts.map((product, i) => (
                    <motion.div
                      key={product._id}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      className="cursor-pointer"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      <Card className="hover:shadow-lg overflow-hidden transition">
                        <img
                          src={resolveImage((product.images && product.images[0]) || FALLBACK)}
                          alt={product.name}
                          className="w-full h-44 object-cover hover:scale-105 transition-transform"
                        />
                        <CardContent className="p-4 space-y-2">
                          <h3 className="font-semibold text-gray-800">{product.name}</h3>
                          <div className="flex items-center space-x-1 text-yellow-500">
                            {Array(Math.round(product.rating || 0))
                              .fill()
                              .map((_, idx) => <Star key={idx} size={14} fill="currentColor" />)}
                            <span className="text-sm text-gray-500 ml-2">{product.rating || 0}</span>
                          </div>
                          <p className="text-indigo-600 font-bold">${product.price}</p>
                          <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                          >
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </section>
          </main>

          {/* Categories Sidebar */}
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shop by Category</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
                {categories.map((cat, i) => (
                  <motion.div
                    key={i}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer hover:scale-105 ${cat.color} transition-transform`}
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(`/categories?q=${encodeURIComponent(cat.name)}`)}
                  >
                    <div className="bg-white p-3 rounded-full shadow-sm">{cat.icon}</div>
                    <p className="font-medium text-sm mt-2">{cat.name}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Footer CTA */}
        <footer className="text-center py-8 text-gray-600 border-t mt-10">
          <p>© {new Date().getFullYear()} ShopEase. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
