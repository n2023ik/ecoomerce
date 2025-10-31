# 🔐 Authentication & User Flow Guide

## Overview
Your e-commerce platform now has a complete authentication system with role-based access control:
- **Customer**: Browse products, add to cart, place orders, track orders
- **Seller**: Manage products, view sales dashboard, track inventory
- **Admin**: Full system access, analytics, user management

## 🚀 Getting Started

### 1. Start Both Servers

**Backend (API):**
```powershell
cd c:\ecomerce
node app.js
```
Backend runs at: **http://localhost:3000**

**Frontend (React):**
```powershell
cd c:\ecomerce\client
npm run dev
```
Frontend runs at: **http://localhost:5173**

### 2. Open Your Browser
Navigate to: **http://localhost:5173**

---

## 📝 User Registration & Login

### Customer Account
1. Click **"Login/Register"** button in the navigation
2. You'll see the unified Auth page
3. Toggle to **"Sign Up"** if registering for the first time
4. Fill in:
   - Username
   - Email
   - Password
   - Confirm Password
5. Click **"Register"** or **"Sign Up"**
6. After successful registration, you're automatically logged in and redirected to your account page

### Seller Account
1. Navigate to **http://localhost:5173/seller/register**
2. Fill in your details (username, email, password)
3. After registration, you're logged in as a seller
4. You'll be redirected to the Seller Dashboard at `/seller`

### Admin Account
1. Admin accounts must be created via the backend script (for security)
2. Run:
   ```powershell
   cd c:\ecomerce
   node createAdmin.js
   ```
3. Navigate to **http://localhost:5173/admin/login**
4. Log in with your admin credentials
5. You'll be redirected to the Admin Dashboard at `/admin`

---

## 🛍️ Shopping Flow (Customer)

### Browse Products
- Home page displays:
  - **Hero Banner**: Featured deals and promotions
  - **New Arrivals**: Latest products
  - **Trending Products**: Popular items
  - **Categories**: Browse by category

### View Product Details
1. Click any product card
2. You'll see:
   - Product images (gallery)
   - Price and ratings
   - Key features
   - Customer reviews
3. Use **"Add to Cart"** or **"Buy Now"** buttons

⚠️ **Login Required**: If not logged in, you'll be prompted to login before adding to cart

### Add to Cart
1. Click **"Add to Cart"** on any product
2. Cart is saved in localStorage (persists across sessions)
3. Navigate to **Checkout** via the navigation button

### Checkout Process
1. Click **"🛒 Checkout"** in the navigation
2. Review your cart items
3. Fill in shipping information:
   - Full Name
   - Address
   - City
   - Postal Code
4. Select payment method (Credit/Debit Card, UPI, Cash on Delivery)
5. Click **"Complete Purchase"**
6. Order is created and you're redirected to Order Tracking

### Track Your Order
- After placing an order, you're redirected to `/order-tracking/:orderId`
- View:
  - Order timeline (Ordered → Processing → Shipped → Delivered)
  - Delivery details
  - Estimated delivery date
  - Contact support options

---

## 📊 Seller Dashboard

### Access
- URL: **http://localhost:5173/seller**
- Login required with **seller role**

### Features
- **Performance Stats**: Revenue, orders, products, ratings
- **Product Grid**: View and manage your products
- **Sales Overview**: Charts and trends
- Navigate back to home with the **"Back to Home"** button

---

## 👑 Admin Dashboard

### Access
- URL: **http://localhost:5173/admin**
- Login required with **admin role**

### Features
- **System Statistics**: Total revenue, users, sales, pending orders
- **Top Sellers**: Performance leaderboard
- **Activity Logs**: Recent system events
- **Reports**: Generate monthly reports

---

## 🔒 Authentication Technical Details

### Backend (JWT-based)
- **Auth Routes**: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- **Cookie-based**: JWT token stored in httpOnly cookie (`auth_token`)
- **Token Lifetime**: 7 days
- **Role Enforcement**: Seller registration publicly available; admin only via script

### Frontend (React Context)
- **AuthContext**: Manages global user state
- **AuthProvider**: Wraps the entire app in `App.jsx`
- **useAuth Hook**: Access user, login, register, logout functions
- **Protected Routes**:
  - `PrivateRoute`: Requires any authenticated user
  - `RoleRoute`: Requires specific role(s)

### Authentication Flow
1. User logs in/registers via Auth page
2. Backend sets httpOnly cookie with JWT
3. Frontend calls `/api/auth/me` to fetch user data
4. User state stored in AuthContext
5. Components use `useAuth()` to access user
6. Protected routes redirect to `/auth` if not logged in

### Cart & Session
- **Cart**: Stored in localStorage as JSON
- **Session**: Backend cookie + Frontend AuthContext
- **Logout**: Clears cookie and AuthContext state

---

## 🛡️ Security Features

1. **Password Hashing**: bcryptjs with salt (10 rounds)
2. **HttpOnly Cookies**: Prevents XSS attacks
3. **CORS**: Restricted to frontend origin (localhost:5173)
4. **Role-Based Access**: Admin endpoints protected
5. **Login Required**: Orders and checkout require authentication
6. **Admin Creation**: Separate script, not public API

---

## 🧪 Testing the Flow

### Test Customer Flow
```powershell
# 1. Register a customer account
# Navigate to http://localhost:5173/auth
# Sign up as customer

# 2. Browse products on home page
# 3. Click a product to view details
# 4. Add product to cart
# 5. Go to Checkout
# 6. Fill shipping info and complete purchase
# 7. View order in Order Tracking
```

### Test Seller Flow
```powershell
# 1. Register a seller account
# Navigate to http://localhost:5173/seller/register
# Sign up as seller

# 2. Access Seller Dashboard
# View products, stats, and performance
```

### Test Admin Flow
```powershell
# 1. Create admin account
cd c:\ecomerce
node createAdmin.js

# 2. Login as admin
# Navigate to http://localhost:5173/admin/login
# Enter admin credentials

# 3. Access Admin Dashboard
# View system stats, top sellers, activity logs
```

---

## 📱 Navigation Structure

```
Home (/)
├── Product Detail (/product/:id)
├── Checkout (/checkout) [Protected]
├── Order Tracking (/order-tracking/:orderId) [Protected]
├── Account (/account) [Protected]
│
├── Auth (/auth, /login, /register)
├── Seller Login (/seller/login)
├── Seller Register (/seller/register)
├── Seller Dashboard (/seller) [Protected - Seller Role]
│
└── Admin Login (/admin/login)
    └── Admin Dashboard (/admin) [Protected - Admin Role]
```

---

## 🐛 Troubleshooting

### "Please login" alerts
- Make sure you're logged in via the Auth page
- Check browser console for authentication errors
- Verify backend is running and MongoDB is connected

### Orders not creating
- Check backend console for errors
- Verify user is authenticated (check `/api/auth/me` response)
- Ensure cart has items in localStorage

### Role-based access denied
- Verify your user role in Account page
- Admin accounts must be created via `createAdmin.js`
- Seller accounts must use `/seller/register`

### Cookie not set
- Ensure frontend and backend are on correct ports
- Check CORS settings in `app.js`
- Verify `credentials: 'include'` in fetch calls

---

## 🎨 UI Components

### Auth Pages
- **Unified Auth** (`/auth`): Customer login/register with toggle
- **Seller Auth**: Purple gradient theme, dedicated login/register
- **Admin Auth**: Dark theme, secure login only

### Navigation
- Shows username when logged in
- **Logout** button clears session
- **Account** link to view profile
- Role-based navigation (Seller/Admin dashboard links)

### Product Cards
- Image, name, price, rating
- Hover effects and animations (Framer Motion)
- Click to view details
- **Add to Cart** button (login-gated)

### Checkout
- Cart summary with item cards
- Shipping form (name, address, city, postal code)
- Payment method dropdown
- Order summary sidebar
- **Complete Purchase** button

---

## 📦 Dependencies

### Backend
- `express`: Web server
- `mongoose`: MongoDB ORM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication
- `cookie-parser`: Cookie handling
- `cors`: Cross-origin requests

### Frontend
- `react`: UI framework
- `react-router-dom`: Client-side routing
- `framer-motion`: Animations
- `tailwindcss`: Styling
- `lucide-react`: Icons
- `vite`: Build tool

---

## 🚀 Next Steps

### Recommended Enhancements
1. **Email Verification**: Send confirmation emails after registration
2. **Password Reset**: Forgot password flow
3. **Profile Editing**: Update user info, change password
4. **Order History**: View all past orders in Account page
5. **Product Search**: Search bar with filters
6. **Reviews & Ratings**: Customer product reviews
7. **Wishlist**: Save products for later
8. **Payment Integration**: Stripe, PayPal, Razorpay
9. **Image Upload**: Allow sellers to upload product images
10. **Real-time Notifications**: WebSocket for order updates

---

## 📞 Support

If you encounter issues:
1. Check backend console for errors
2. Check browser console for frontend errors
3. Verify MongoDB is running
4. Ensure both servers are on correct ports (3000, 5173)
5. Clear browser cookies/localStorage if needed

---

**Happy Selling! 🛍️**
