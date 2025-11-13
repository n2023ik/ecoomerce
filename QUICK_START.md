# 🎯 Quick Start Guide

## Start Servers

```powershell
# Terminal 1 - Backend
cd c:\ecomerce
node app.js
# Backend: http://localhost:3000

# Terminal 2 - Frontend
cd c:\ecomerce\client
npm run dev
# Frontend: http://localhost:5173
```

## Create Admin (First Time Only)

```powershell
cd c:\ecomerce
node createAdmin.js
```

## Main URLs

| Role | URL | Action |
|------|-----|--------|
| **Customer** | http://localhost:5173/auth | Register/Login |
| **Seller** | http://localhost:5173/seller/register | Register |
| **Seller** | http://localhost:5173/seller/login | Login |
| **Admin** | http://localhost:5173/admin/login | Login |

## Quick Test Flow

### 1. Customer Journey
1. Go to http://localhost:5173
2. Click **"Login/Register"** → Sign up
3. Browse products on home page
4. Click a product → View details
5. Click **"Add to Cart"** (requires login)
6. Click **"🛒 Checkout"** in nav
7. Fill shipping info
8. Click **"Complete Purchase"**
9. View order tracking

### 2. Seller Journey
1. Go to http://localhost:5173/seller/register
2. Register as seller
3. Access http://localhost:5173/seller
4. View dashboard with products and stats

### 3. Admin Journey
1. Run: `node createAdmin.js` (first time only)
2. Go to http://localhost:5173/admin/login
3. Login with admin credentials
4. Access http://localhost:5173/admin
5. View system analytics and management

## Key Features

✅ **Authentication**: JWT-based with httpOnly cookies  
✅ **Role-Based Access**: Customer, Seller, Admin  
✅ **Protected Routes**: Login-gated checkout and dashboards  
✅ **Cart Persistence**: localStorage for cart items  
✅ **Order Management**: Create and track orders  
✅ **Modern UI**: Tailwind CSS + Framer Motion animations  

## Troubleshooting

### Backend not starting
- Check if MongoDB is running
- Port 3000 may be in use

### Frontend not starting
- Run `npm install` in client folder
- Port 5173 may be in use

### Login not working
- Check backend console for errors
- Verify `/api/auth/login` endpoint is accessible
- Clear browser cookies

### Cart not persisting
- Check browser localStorage
- Ensure not in incognito/private mode

## File Structure

```
c:\ecomerce/
├── app.js                    # Backend server
├── db.js                     # MongoDB connection
├── routes/                   # API routes
│   ├── auth.js              # Authentication endpoints
│   ├── product.js           # Product CRUD
│   └── order.js             # Order management
├── models/                   # MongoDB schemas
│   ├── user.js              # User model
│   ├── product.js           # Product model
│   └── order.js             # Order model
└── client/                   # React frontend
    ├── src/
    │   ├── App.jsx          # Router & routes
    │   ├── auth/
    │   │   └── AuthContext.jsx  # Auth state management
    │   ├── pages/           # Page components
    │   │   ├── Home.jsx
    │   │   ├── Auth.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── OrderTracking.jsx
    │   │   ├── SellerDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── Account.jsx
    │   └── components/ui/   # Reusable UI components
    └── vite.config.js       # Vite config with API proxy
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user

### Products
- GET `/api/products` - List all products
- GET `/api/products/:id` - Get product by ID
- POST `/api/products` - Create product (seller/admin)
- PUT `/api/products/:id` - Update product
- DELETE `/api/products/:id` - Delete product

### Orders
- GET `/api/orders` - List all orders
- GET `/api/orders/:id` - Get order by ID
- POST `/api/orders` - Create new order (requires auth)
- PATCH `/api/orders/:id` - Update order status

## Environment Variables

Create `.env` file in root:

```env
JWT_SECRET=your_secret_key_here
MONGO_URI=mongodb://127.0.0.1:27017/e-commerce
```

## Support & Documentation

- Full Auth Guide: `AUTHENTICATION_GUIDE.md`
- Cleanup Details: `CLEANUP_COMPLETE.md`
- Access Instructions: `HOW_TO_ACCESS.md`

---

🚀 **You're all set!** Navigate to http://localhost:5173 and start shopping!
