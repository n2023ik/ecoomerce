import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CreditCard, Truck, ShoppingBag, ArrowLeft } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'Credit / Debit Card'
  });

  useEffect(() => {
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);

    // Check if user is logged in
    if (!user) {
      alert('Please login to checkout');
  navigate('/auth');
    }
  }, [navigate, user]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompletePurchase = async () => {
    if (!formData.fullName || !formData.address || !formData.city || !formData.postalCode) {
      alert('Please fill in all shipping information');
      return;
    }

    if (!user) {
      alert('Please login to complete purchase');
  navigate('/auth');
      return;
    }

    try {
      const orderData = {
        user: user._id || user.id,
        username: user.username,
        items: cartItems.map(item => ({
          product: item.productId,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.qty
        })),
        total: total,
        status: 'pending',
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: '',
          zipCode: formData.postalCode
        }
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const order = await res.json();
        localStorage.removeItem('cart');
        alert('Order placed successfully!');
        navigate(`/order-tracking/${order._id}`);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || 'Failed to place order. Please try again.');
      }
    } catch (e) {
      console.error(e);
      alert('Error placing order');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <Button onClick={() => navigate('/')} className="bg-indigo-600 hover:bg-indigo-700 text-white mt-4">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors w-fit"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section - Cart Summary */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

            {/* Cart Items */}
            {cartItems.map((item, i) => (
              <Card key={i} className="flex items-center gap-4 p-4 hover:shadow-md transition">
                <img
                  src={item.image || FALLBACK_IMG}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">Quantity: {item.qty}</p>
                </div>
                <div className="text-indigo-600 font-bold text-lg">${(item.price * item.qty).toFixed(2)}</div>
              </Card>
            ))}

            {/* Shipping Info */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Truck className="text-indigo-600" /> Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <ShoppingBag className="text-indigo-600" /> Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button
                  onClick={() => alert('Proceeding to payment...')}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-lg rounded-xl"
                >
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <CreditCard className="text-indigo-600" /> Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option>Credit / Debit Card</option>
                  <option>UPI / Net Banking</option>
                  <option>Cash on Delivery</option>
                </select>
                <Button
                  onClick={handleCompletePurchase}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 text-lg rounded-xl"
                >
                  Complete Purchase
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
