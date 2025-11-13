import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Button } from './ui/button'

export default function ProductCard({ product, onAddToCart }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      await onAddToCart(product)
    } finally {
      setIsLoading(false)
    }
  }

  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop'
  const rating = product.rating || 0
  const reviewCount = product.reviewCount || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300">
          {/* Image Container */}
          <div className="relative h-48 bg-gray-100 overflow-hidden">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
            
            {product.stock <= 5 && product.stock > 0 && (
              <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {product.stock} left
              </div>
            )}
            
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category */}
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-2">
              {product.category || 'Uncategorized'}
            </p>

            {/* Product Name */}
            <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">({reviewCount})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-gray-900">
                ${product.price?.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {product.sold || 0} sold
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isLoading}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4" />
          {isLoading ? 'Adding...' : 'Add'}
        </Button>
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`p-2 rounded-lg transition-all ${
            isWishlisted
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>
    </motion.div>
  )
}
