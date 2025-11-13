import React, { useMemo, useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../auth/AuthContext"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Monitor, Shirt, ShoppingBag, Watch, Headphones, Box, ArrowLeft, Star } from "lucide-react"
import { resolveImage, FALLBACK_IMG as FALLBACK } from "../lib/image"

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'

export default function CategoryPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const params = new URLSearchParams(location.search)
  const initial = params.get('q') || null
  const [selectedCategory, setSelectedCategory] = useState(initial)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Normalize helper and basic alias map to handle minor typos (e.g., "footware")
  const normalize = (s) => (s ? String(s).trim().toLowerCase() : '')
  const alias = useMemo(() => ({
    footware: 'footwear',
  }), [])

  useEffect(() => {
    const p = new URLSearchParams(location.search)
    const q = p.get('q') || null
    setSelectedCategory(q)
  }, [location.search])

  useEffect(() => {
    if (selectedCategory) {
      loadProducts()
    }
  }, [selectedCategory])

  async function loadProducts() {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        
        if (selectedCategory) {
          // Filter products by category (strict, normalized)
          const target = normalize(alias[normalize(selectedCategory)] || selectedCategory)
          const filtered = data.filter(p => normalize(p.category) === target)
          setProducts(filtered)
        } else {
          setProducts(data)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(() => ([
    { name: "Electronics", icon: <Monitor className="text-blue-600" size={26} />, color: "from-blue-100 to-blue-200" },
    { name: "Apparel", icon: <Shirt className="text-pink-600" size={26} />, color: "from-pink-100 to-pink-200" },
    { name: "Bags", icon: <ShoppingBag className="text-yellow-600" size={26} />, color: "from-yellow-100 to-yellow-200" },
    { name: "Watches", icon: <Watch className="text-purple-600" size={26} />, color: "from-purple-100 to-purple-200" },
    { name: "Accessories", icon: <Headphones className="text-green-600" size={26} />, color: "from-green-100 to-green-200" },
    { name: "Footwear", icon: <Box className="text-gray-600" size={26} />, color: "from-gray-100 to-gray-200" },
  ]), [])

  function openCategory(name) {
    navigate(`/categories?q=${encodeURIComponent(name)}`)
  }

  function handleAddToCart(product) {
    if (!user) {
      alert('Please login to add items to cart')
      navigate('/auth')
      return
    }
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const idx = cart.findIndex(i => i.productId === product._id)
      if (idx >= 0) cart[idx].qty += 1
      else cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: 1,
        image: (product.images && product.images[0]) || FALLBACK_IMG
      })
      localStorage.setItem('cart', JSON.stringify(cart))
      alert('Added to cart!')
    } catch {
      alert('Could not add to cart')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors w-fit mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            {selectedCategory || 'Shop by Category'}
          </h1>
        </div>

        {!selectedCategory ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-gray-600 mb-8 text-lg">Explore our wide range of products across different categories</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {categories.map((cat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  className={`cursor-pointer bg-gradient-to-br ${cat.color} rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all`}
                  onClick={() => openCategory(cat.name)}
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="bg-white p-4 rounded-full shadow-md">
                      {cat.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 text-xl">{cat.name}</h3>
                    <p className="text-sm text-gray-600">Browse collection</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-between items-center mb-8">
                <p className="text-gray-600">{loading ? 'Loading...' : `${products.length} products found`}</p>
                <Button onClick={() => navigate('/categories')} className="bg-gray-800 text-white hover:bg-gray-900">
                  View All Categories
                </Button>
              </div>

              {loading ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl shadow-sm">
                  <div className="mb-3 text-2xl">🧐</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">We couldn't find any items for this category.</p>
                  <div className="flex gap-3">
                    <Button onClick={() => navigate('/categories')} className="bg-gray-800 text-white hover:bg-gray-900">All Categories</Button>
                    <Button variant="outline" onClick={() => navigate('/')}>Go Home</Button>
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((p, i) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
                      onClick={() => navigate(`/product/${p._id}`)}
                    >
                      <div className="relative overflow-hidden">
                        <img 
                          src={resolveImage((p.images && p.images[0]) || FALLBACK)} 
                          alt={p.name} 
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300" 
                        />
                        {p.rating && (
                          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <span className="text-sm font-semibold">{p.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 text-lg mb-2 truncate">{p.name}</h3>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{p.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-indigo-600 font-bold text-xl">${p.price}</p>
                          {p.stock > 0 && (
                            <span className="text-xs text-green-600 font-medium">{p.stock} in stock</span>
                          )}
                        </div>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddToCart(p)
                          }}
                          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}


