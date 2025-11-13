import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Lock, User } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export default function SellerLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/seller', { replace: true })
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const slideVariants = {
    hidden: { x: 150, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    exit: { x: -150, opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-6 overflow-hidden">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <Card className="overflow-hidden shadow-2xl border-0 rounded-2xl bg-white/90 backdrop-blur-xl">
          <div className="bg-white p-8 rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div key="seller-login" variants={slideVariants} initial="hidden" animate="visible" exit="exit">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">Seller Sign in</h1>
                <p className="text-center text-gray-500 mb-6">Access your seller dashboard</p>
                {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="relative">
                    <User className="absolute top-3 left-3 text-gray-400" size={18} />
                    <input type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                  </div>
                  <div className="relative">
                    <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
                    <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-2 rounded-xl shadow-md transition-all">{loading ? 'Signing in...' : 'Sign In'}</Button>
                  </motion.div>
                </form>
                <div className="text-center mt-6">
                  <p className="text-gray-500 text-sm">New seller? <Link to="/seller/register" className="text-purple-600 font-semibold hover:underline">Create seller account</Link></p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}


