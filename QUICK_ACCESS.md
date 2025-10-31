# 🔗 Quick Access Links & Credentials

## 🌐 Application URLs

### Main Application
- **Home Page**: http://localhost:5173
- **Backend API**: http://localhost:3000

### Customer Pages
- **Customer Login/Register**: http://localhost:5173/auth
- **Account Page**: http://localhost:5173/account
- **Checkout**: http://localhost:5173/checkout
- **Order Tracking**: http://localhost:5173/order-tracking

### Seller Pages
- **Seller Login**: http://localhost:5173/seller/login
- **Seller Register**: http://localhost:5173/seller/register
- **Seller Dashboard**: http://localhost:5173/seller

### Admin Pages
- **Admin Login**: http://localhost:5173/admin/login
- **Admin Dashboard**: http://localhost:5173/admin

### Other Pages
- **Product Detail**: http://localhost:5173/product/:id (replace :id with actual product ID)
- **Categories**: http://localhost:5173/categories

---

## 🔑 Test Credentials

### Create Admin Account
```powershell
cd c:\ecomerce
node createAdmin.js
```
Follow the prompts to create an admin account.

### Create Customer Account
1. Go to: http://localhost:5173/auth
2. Click "Sign Up"
3. Fill in:
   - Username: `testcustomer`
   - Email: `customer@test.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click "Register"

### Create Seller Account
1. Go to: http://localhost:5173/seller/register
2. Fill in:
   - Username: `testseller`
   - Email: `seller@test.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Create Account"

---

## 🚀 Server Start Commands

### Start Both Servers

**Backend (PowerShell Terminal 1):**
```powershell
cd c:\ecomerce
node app.js
```
✅ Backend will run at: http://localhost:3000

**Frontend (PowerShell Terminal 2):**
```powershell
cd c:\ecomerce\client
npm run dev
```
✅ Frontend will run at: http://localhost:5173

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
POST   /api/auth/logout      - Logout user
GET    /api/auth/me          - Get current user
```

### Product Endpoints
```
GET    /api/products         - List all products
GET    /api/products/:id     - Get product by ID
POST   /api/products         - Create product
PUT    /api/products/:id     - Update product
DELETE /api/products/:id     - Delete product
```

### Order Endpoints
```
GET    /api/orders           - List all orders
GET    /api/orders/:id       - Get order by ID
POST   /api/orders           - Create order (requires auth)
PATCH  /api/orders/:id       - Update order status
```

### Other Endpoints
```
GET    /api/sellers          - List sellers
GET    /api/dashboard        - Dashboard stats
GET    /api/coupons          - List coupons
GET    /api/notifications    - List notifications
GET    /api/returns          - List returns
GET    /api/disputes         - List disputes
GET    /api/reviews          - List reviews
GET    /api/wishlist         - Get wishlist
GET    /api/analytics        - Analytics data
GET    /api/settings         - Site settings
```

---

## 🧪 Testing with PowerShell

### Test Products API
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/products" -Method GET
```

### Test Register API
```powershell
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
    role = "customer"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Test Login API
```powershell
$body = @{
    username = "testuser"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -SessionVariable session
```

### Test Get Current User (with session)
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/me" `
    -Method GET `
    -WebSession $session
```

---

## 📝 Sample Product Data

After running `node seed.js`, you should have these products:

1. **Wireless Headphones Pro** - $149.99
2. **Smart Watch Series X** - $299.99
3. **Ultra HD Camera** - $599.99
4. **Bluetooth Speaker** - $79.99
5. **Gaming Laptop** - $1299.99

View them at: http://localhost:5173

---

## 🎯 Quick Test Scenarios

### Scenario 1: Complete Customer Shopping Flow
```
1. Open: http://localhost:5173
2. Register at: http://localhost:5173/auth
3. Browse products on home page
4. Click any product card
5. Click "Add to Cart"
6. Click "🛒 Checkout" in navigation
7. Fill shipping information
8. Click "Complete Purchase"
9. View order at: http://localhost:5173/order-tracking/:orderId
```

### Scenario 2: Seller Account Setup
```
1. Open: http://localhost:5173/seller/register
2. Register as seller
3. Automatically redirected to: http://localhost:5173/seller
4. View your seller dashboard
5. Click "Back to Home" to browse site
```

### Scenario 3: Admin Access
```
1. Run: node createAdmin.js
2. Open: http://localhost:5173/admin/login
3. Enter admin credentials
4. Access: http://localhost:5173/admin
5. View system statistics
```

---

## 🔐 Security Notes

### JWT Cookie Details
- **Cookie Name**: `auth_token`
- **HttpOnly**: Yes (prevents JavaScript access)
- **SameSite**: Lax
- **MaxAge**: 7 days (604800000 ms)
- **Secure**: No (set to Yes in production with HTTPS)

### Password Security
- **Hashing Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Stored**: Hashed password in MongoDB

### CORS Configuration
- **Allowed Origin**: http://localhost:5173
- **Credentials**: true (allows cookies)

---

## 🗄️ Database Information

### MongoDB Connection
```
mongodb://127.0.0.1:27017/e-commerce
```

### Collections
```
- users
- products
- orders
- sellers
- reviews
- wishlist
- coupons
- notifications
- returns
- disputes
- categories
- sitesettings
```

### Check MongoDB Connection
```powershell
# Using MongoDB Compass
# Connection String: mongodb://127.0.0.1:27017/e-commerce

# Or using mongo shell
mongo mongodb://127.0.0.1:27017/e-commerce
```

---

## 📂 Important Files

### Configuration Files
```
c:\ecomerce\
├── app.js                       - Main backend server
├── db.js                        - MongoDB connection
├── seed.js                      - Seed products
├── createAdmin.js               - Create admin user
├── package.json                 - Backend dependencies
└── .env                         - Environment variables (create if needed)

c:\ecomerce\client\
├── vite.config.js               - Vite config (API proxy)
├── tailwind.config.js           - Tailwind CSS config
├── package.json                 - Frontend dependencies
└── src\
    ├── App.jsx                  - Router & routes
    ├── main.jsx                 - React entry point
    ├── index.css                - Global styles
    ├── auth\AuthContext.jsx     - Auth state management
    ├── pages\                   - All page components
    └── components\ui\           - Reusable UI components
```

### Documentation Files
```
c:\ecomerce\
├── README.md                    - General project info
├── QUICK_START.md               - Quick start guide
├── AUTHENTICATION_GUIDE.md      - Auth documentation
├── AUTH_INTEGRATION_COMPLETE.md - Integration summary
├── FLOW_DIAGRAM.md              - Visual flow diagrams
├── QUICK_ACCESS.md              - This file
├── HOW_TO_ACCESS.md             - Access instructions
└── CLEANUP_COMPLETE.md          - Cleanup details
```

---

## 🛠️ Troubleshooting URLs

### Backend Issues
- Check if MongoDB is running
- Verify port 3000 is available
- Check backend console for errors: Look at terminal running `node app.js`
- Test API directly: http://localhost:3000/api/products

### Frontend Issues
- Check if Vite is running
- Verify port 5173 is available
- Check browser console for errors (F12)
- Try clearing browser cache and cookies

### Authentication Issues
- Clear browser cookies: F12 → Application → Cookies → Delete `auth_token`
- Clear localStorage: F12 → Application → Local Storage → Clear
- Check backend auth response: F12 → Network → Check `/api/auth/login` response

---

## 📱 Mobile Testing (Optional)

If you want to test on mobile devices on the same network:

### Find Your Computer's IP
```powershell
ipconfig
# Look for IPv4 Address under your active network adapter
# Example: 192.168.1.100
```

### Update Frontend to Allow Mobile Access
```powershell
cd c:\ecomerce\client
npm run dev -- --host
```

### Access from Mobile
```
http://YOUR_IP_ADDRESS:5173
Example: http://192.168.1.100:5173
```

**Note**: You'll also need to update CORS in `app.js` to allow your IP.

---

## 🎉 Everything You Need!

**Quick Access Checklist:**
- ✅ Backend: http://localhost:3000
- ✅ Frontend: http://localhost:5173
- ✅ Main App: http://localhost:5173
- ✅ Customer Auth: http://localhost:5173/auth
- ✅ Seller Dashboard: http://localhost:5173/seller
- ✅ Admin Dashboard: http://localhost:5173/admin

**You're ready to go!** 🚀
