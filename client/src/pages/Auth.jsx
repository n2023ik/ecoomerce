import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Lock, Mail, User } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export default function Auth() {
  const tabs = useMemo(() => ([
    { key: 'customer', label: 'Customer', accent: 'from-pink-500 via-purple-600 to-indigo-600' }
  ]), [])

  const [active, setActive] = useState('customer')
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const slideVariants = {
    hidden: { x: 150, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { x: -150, opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } },
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await login(username, password)
        navigate('/account', { replace: true })
      } else {
        if (password !== confirmPassword) throw new Error('Passwords do not match')
        await register(username, email, password, 'customer')
        navigate('/account', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  function TabIcon() { return <User size={16} className="mr-2" /> }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-tr ${tabs.find(t=>t.key===active).accent} p-6 overflow-hidden`}>
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-lg">
        <Card className="overflow-hidden shadow-2xl border-0 rounded-2xl bg-white/90 backdrop-blur-xl">
          <div className="p-2 pt-4">
            

            <div className="bg-white p-8 rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div key={`${active}-${isLogin?'login':'register'}`} variants={slideVariants} initial="hidden" animate="visible" exit="exit">
                  <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">{isLogin ? 'Sign in' : 'Create your account'}</h1>
                  <p className="text-center text-gray-500 mb-6">{isLogin ? 'Welcome back' : 'Join us and start shopping'}</p>
                  {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
                  <form onSubmit={onSubmit} className="space-y-5">
                    <div className="relative">
                      <User className="absolute top-3 left-3 text-gray-400" size={18} />
                      <input type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                    </div>

                    {!isLogin && (
                      <div className="relative">
                        <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                      </div>
                    )}

                    <div className="relative">
                      <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
                      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                    </div>

                    {!isLogin && (
                      <div className="relative">
                        <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
                        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                      </div>
                    )}

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button disabled={loading} className={`w-full ${active==='admin' ? 'bg-gray-900 hover:bg-black' : 'bg-indigo-600 hover:bg-indigo-700'} text-white text-lg py-2 rounded-xl shadow-md transition-all`}>
                        {loading ? (isLogin ? 'Submitting...' : 'Creating...') : (isLogin || active==='admin' ? 'Login' : 'Register')}
                      </Button>
                    </motion.div>
                  </form>

                  <div className="text-center mt-6">
                    <p className="text-gray-500 text-sm">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}
                      <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-semibold ml-1 hover:underline">
                        {isLogin ? 'Sign Up' : 'Login'}
                      </button>
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}


