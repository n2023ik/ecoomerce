import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Truck, PackageCheck, Clock, MapPin, CheckCircle2, ArrowLeft } from "lucide-react";

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        if (orderId) {
          const res = await fetch(`/api/orders/${orderId}`);
          if (res.ok) {
            const data = await res.json();
            setOrder(data);
          } else {
            console.error('Order not found');
          }
        } else {
          // Demo order for testing
          setOrder({
            _id: "ORD-24567",
            status: "shipped",
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            items: [
              {
                product: {
                  name: "Wireless Noise Cancelling Headphones",
                  images: ["https://images.unsplash.com/photo-1585386959984-a415522316c6?q=80&w=2070&auto=format&fit=crop"]
                },
                quantity: 1
              },
              {
                product: {
                  name: "Smart Watch",
                  images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"]
                },
                quantity: 1
              }
            ],
            shippingAddress: {
              fullName: "John Doe",
              address: "45, Green Valley Apartments, Sector 21",
              city: "New Delhi",
              postalCode: "110001"
            }
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <PackageCheck size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Order not found</h2>
        <Button onClick={() => navigate('/')} className="bg-indigo-600 hover:bg-indigo-700 text-white mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

  const steps = [
    { title: "Order Placed", date: new Date(order.createdAt).toLocaleDateString(), completed: true },
    { title: "Order Processed", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(), completed: true },
    { title: "Shipped", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(), completed: order.status !== 'pending' },
    { title: "Out for Delivery", date: "Expected Oct 21, 2025", completed: order.status === 'delivered' },
    { title: "Delivered", date: order.status === 'delivered' ? new Date().toLocaleDateString() : "Pending", completed: order.status === 'delivered' },
  ];

  const estimatedDelivery = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const fullAddress = order.shippingAddress
    ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`
    : "Address not available";

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <div
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors w-fit"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Track Your Order</h1>
          <span className="text-gray-600 text-sm">Order ID: <strong>{order._id}</strong></span>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <PackageCheck className="text-indigo-600" /> Ordered Items
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6 overflow-x-auto pb-4">
            {order.items && order.items.map((item, i) => (
              <div key={i} className="text-center flex-shrink-0">
                <img
                  src={(item.product.images && item.product.images[0]) || FALLBACK_IMG}
                  alt={item.product.name}
                  className="w-32 h-32 object-cover rounded-xl shadow-sm mb-2"
                />
                <p className="text-gray-700 font-medium text-sm max-w-[128px]">{item.product.name}</p>
                <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tracking Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Truck className="text-indigo-600" /> Delivery Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-4 border-indigo-600 ml-4 space-y-6 pl-2">
              {steps.map((step, i) => (
                <div key={i} className="ml-6 relative">
                  <div
                    className={`absolute -left-9 w-6 h-6 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    {step.completed && <CheckCircle2 className="text-white" size={16} />}
                  </div>
                  <div className="flex items-start gap-3">
                    <div>
                      <p className={`font-semibold ${step.completed ? 'text-gray-800' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                      <p className="text-gray-500 text-sm">{step.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <MapPin className="text-indigo-600" /> Delivery Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <p>
              <span className="font-semibold">Current Status:</span>{' '}
              <span className="capitalize">{order.status || 'Processing'}</span>
            </p>
            <p>
              <span className="font-semibold">Estimated Delivery:</span> {estimatedDelivery}
            </p>
            <p>
              <span className="font-semibold">Delivery Address:</span> {fullAddress}
            </p>
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">Contact Support</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
