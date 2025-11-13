import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Star, ArrowLeft } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { resolveImage, FALLBACK_IMG as FALLBACK } from "../lib/image";

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        if (!cancelled) setProduct(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) alert('Failed to load product');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  function handleAddToCart() {
    try {
      if (!user) {
        alert('Please login to add items to cart');
  navigate('/auth');
        return;
      }
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const idx = cart.findIndex((i) => i.productId === product._id);
      if (idx >= 0) cart[idx].qty += 1;
      else cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: 1,
        image: (product.images && product.images[0]) || FALLBACK_IMG
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Added to cart!');
    } catch {
      alert('Could not add to cart');
    }
  }

  function handleBuyNow() {
    if (!user) {
      alert('Please login to place an order');
  navigate('/auth');
      return;
    }
    handleAddToCart();
    navigate('/checkout');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl text-gray-500">Product not found</div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [FALLBACK];
  const features = [
    product.category ? `Category: ${product.category}` : 'Premium Quality',
    `In Stock: ${product.stock || 0} units`,
    `Sold: ${product.sold || 0} times`,
    'Fast Shipping Available',
    'Secure Payment Options',
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Back Button */}
        <div
          className="p-4 border-b flex items-center gap-2 text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 p-8">
          {/* Left: Product Images */}
          <div>
            <motion.img
              src={resolveImage(images[0])}
              alt={product.name}
              className="rounded-2xl w-full h-96 object-cover shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />

            {images.length > 1 && (
              <div className="flex gap-4 mt-4">
                {images.slice(1).map((img, i) => (
                  <motion.img
                    key={i}
                    src={resolveImage(img)}
                    alt={`Product view ${i + 2}`}
                    className="w-28 h-28 rounded-xl object-cover cursor-pointer hover:scale-105 transition-transform shadow-sm"
                    whileHover={{ y: -3 }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center mt-2 text-yellow-500">
                {Array(Math.round(product.rating || 0))
                  .fill()
                  .map((_, i) => <Star key={i} fill="currentColor" size={18} />)}
                <span className="ml-2 text-gray-600 text-sm">
                  {product.rating || 0} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            <div>
              <h3 className="font-semibold text-lg mb-2">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="text-3xl font-bold text-indigo-600">${product.price}</div>

            <div className="flex gap-4 mt-4">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-lg rounded-xl shadow"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 text-lg rounded-xl"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold mb-2 text-gray-800">Customer Reviews</h3>
              <div className="text-gray-600 text-sm">★★★★☆ Rated {product.rating || 0} out of 5</div>
              <p className="text-sm text-gray-500 mt-2">
                {product.reviewCount || 0} customer{product.reviewCount !== 1 ? 's' : ''} reviewed this product
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
