import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../auth/AuthContext";

// Helper component for Icons
const Icon = ({ path }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

// Icon paths
const ICONS = {
  user: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  seller: "M12 2L4.5 6.5v9L12 20l7.5-4.5v-9L12 2zm-1 5h2v2h-2V7zm0 4h2v6h-2v-6z",
  admin: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z",
};

export default function RegisterPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user"); // 'user', 'seller', 'admin'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // If Admin role is selected, force login mode and keep it that way (no registration for admin)
  useEffect(() => {
    if (role === 'admin' && !isLogin) setIsLogin(true)
    // Auto-fill and lock admin username to avoid typos
    if (role === 'admin' && formData.username !== 'Nikhil2004') {
      setFormData(prev => ({ ...prev, username: 'Nikhil2004' }))
    }
  }, [role, isLogin])

  const slideVariants = {
    hidden: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: (direction) => ({ x: direction < 0 ? 100 : -100, opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }),
  };

  const roleConfig = {
    user: { 
      title: "Customer", 
      icon: ICONS.user, 
      bgColor: "bg-indigo-600",
      hoverColor: "hover:bg-indigo-700",
      ringColor: "focus:ring-indigo-500",
      textColor: "text-indigo-600",
      textHoverColor: "hover:text-indigo-500",
      shadowColor: "shadow-indigo-500/30"
    },
    seller: { 
      title: "Seller", 
      icon: ICONS.seller,
      bgColor: "bg-teal-600",
      hoverColor: "hover:bg-teal-700",
      ringColor: "focus:ring-teal-500",
      textColor: "text-teal-600",
      textHoverColor: "hover:text-teal-500",
      shadowColor: "shadow-teal-500/30"
    },
    admin: { 
      title: "Admin", 
      icon: ICONS.admin,
      bgColor: "bg-rose-600",
      hoverColor: "hover:bg-rose-700",
      ringColor: "focus:ring-rose-500",
      textColor: "text-rose-600",
      textHoverColor: "hover:text-rose-500",
      shadowColor: "shadow-rose-500/30"
    },
  };

  const activeRole = roleConfig[role];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Admin restrictions: only allow the seeded admin account
      if (role === 'admin') {
        if (isLogin) {
          if (formData.username !== 'Nikhil2004') {
            throw new Error('Only the configured admin username is allowed');
          }
        } else {
          throw new Error('Admin registration is disabled');
        }
      }

      if (isLogin) {
        const uname = (formData.username || '').trim()
        const pwd = formData.password
        if (role === 'admin' && uname !== 'Nikhil2004') {
          throw new Error('Invalid admin ID or password')
        }
        // Backend expects username for login
        await login(uname, pwd);
        // Redirect based on actual server role to avoid mismatches
        try {
          const res = await fetch('/api/auth/me', { credentials: 'include' })
          if (res.ok) {
            const me = await res.json()
            if (me.role === 'admin') navigate('/admin')
            else if (me.role === 'seller') navigate('/seller')
            else navigate('/account')
          } else {
            navigate('/account')
          }
        } catch {
          navigate('/account')
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const apiRole = role === 'user' ? 'customer' : role;
        // Backend expects username + email
        await register(formData.username, formData.email, formData.password, apiRole);
        // Redirect based on role intent
        if (role === 'seller') navigate('/seller');
        else navigate('/account');
      }
    } catch (err) {
      if (role === 'admin') {
        setError('Invalid admin ID or password');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          {/* Role Selector */}
          <div className="flex justify-center bg-gray-100 dark:bg-gray-700 p-1 rounded-xl mb-6">
            {Object.keys(roleConfig).map((key) => (
              <button
                key={key}
                onClick={() => setRole(key)}
                className={`w-full relative py-2.5 px-4 text-sm font-semibold rounded-lg transition-colors duration-300 focus:outline-none ${
                  role === key ? "text-white" : "text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {role === key && (
                  <motion.div
                    layoutId="active-role-pill"
                    className={`absolute inset-0 ${roleConfig[key].bgColor} rounded-lg z-0`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Icon path={roleConfig[key].icon} />
                  {roleConfig[key].title}
                </span>
              </button>
            ))}
          </div>

          <div className="text-center">
            <h1 className={`text-3xl font-bold text-gray-800 dark:text-white mb-2`}>
              {isLogin ? `Welcome Back, ${activeRole.title}` : `Create ${activeRole.title} Account`}
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {role === 'admin'
                ? 'Admin sign-in only. Registration is disabled.'
                : (isLogin ? `Login to access the ${activeRole.title.toLowerCase()} portal` : "Get started with your account")}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait" custom={isLogin}>
            <motion.div
              key={isLogin ? "login" : "register"}
              variants={slideVariants}
              custom={isLogin ? 1 : -1}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-5"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder={role === 'admin' ? 'Nikhil2004' : 'Enter Username'}
                    className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 ${activeRole.ringColor} focus:border-transparent transition`}
                    readOnly={role === 'admin'}
                    required
                  />
                </div>

                {(!isLogin && role !== 'admin') && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 ${activeRole.ringColor} focus:border-transparent transition`}
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your Password"
                    className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 ${activeRole.ringColor} focus:border-transparent transition`}
                    required
                  />
                </div>

                {!isLogin && role !== 'admin' && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your Password"
                      className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 mt-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 ${activeRole.ringColor} focus:border-transparent transition`}
                      required
                    />
                  </div>
                )}

                {isLogin && role === 'user' && (
                  <div className="text-right">
                    <a href="#" className={`text-sm font-medium ${activeRole.textColor} ${activeRole.textHoverColor}`}>
                      Forgot Password?
                    </a>
                  </div>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full ${activeRole.bgColor} ${activeRole.hoverColor} text-white text-base py-3 rounded-xl shadow-lg ${activeRole.shadowColor} transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading ? (isLogin ? 'Logging in...' : 'Creating Account...') : (isLogin ? "Login" : "Create Account")}
                  </button>
                </motion.div>

                {role !== 'admin' ? (
                  <p className="text-center text-gray-600 dark:text-gray-400 text-sm pt-4">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className={`font-semibold ml-1 ${activeRole.textColor} hover:underline`}
                    >
                      {isLogin ? "Register" : "Login"}
                    </button>
                  </p>
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400 text-sm pt-4">Registration for admin is disabled.</p>
                )}
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

