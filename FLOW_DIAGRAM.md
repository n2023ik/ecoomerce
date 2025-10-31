# 🔄 E-Commerce App Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                             │
│                     http://localhost:5173                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    React Frontend                        │ │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │ │
│  │  │   Pages    │  │  AuthContext│  │  UI Components   │  │ │
│  │  │            │  │  (useAuth)  │  │  (Cards,Buttons) │  │ │
│  │  │ - Home     │←→│             │  │                  │  │ │
│  │  │ - Auth     │  │  user       │  │ Tailwind + Framer│ │ │
│  │  │ - Product  │  │  login()    │  │     Motion       │  │ │
│  │  │ - Checkout │  │  register() │  │                  │  │ │
│  │  │ - Account  │  │  logout()   │  │                  │  │ │
│  │  └────────────┘  └────────────┘  └──────────────────┘  │ │
│  │                                                          │ │
│  │  localStorage:                                           │ │
│  │  ├─ cart: [{productId, qty, price, name, image}]       │ │
│  │                                                          │ │
│  │  Cookies:                                                │ │
│  │  └─ auth_token: JWT (HttpOnly)                          │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTP Requests (fetch with credentials)
                     │ Proxy: /api/* → http://localhost:3000
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express Backend                              │
│                   http://localhost:3000                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   API Routes                             │ │
│  │                                                          │ │
│  │  /api/auth                                               │ │
│  │  ├─ POST /register  → Create user, set JWT cookie       │ │
│  │  ├─ POST /login     → Validate, set JWT cookie          │ │
│  │  ├─ POST /logout    → Clear cookie                      │ │
│  │  └─ GET  /me        → Get current user from JWT         │ │
│  │                                                          │ │
│  │  /api/products                                           │ │
│  │  ├─ GET  /          → List all products                 │ │
│  │  ├─ GET  /:id       → Get product by ID                 │ │
│  │  ├─ POST /          → Create product (seller/admin)     │ │
│  │  ├─ PUT  /:id       → Update product                    │ │
│  │  └─ DELETE /:id     → Delete product                    │ │
│  │                                                          │ │
│  │  /api/orders                                             │ │
│  │  ├─ GET  /          → List orders                       │ │
│  │  ├─ GET  /:id       → Get order by ID                   │ │
│  │  ├─ POST /          → Create order (requires auth)      │ │
│  │  └─ PATCH /:id      → Update order status               │ │
│  │                                                          │ │
│  │  Other routes: sellers, dashboard, coupons,             │ │
│  │  notifications, returns, disputes, reviews, wishlist,   │ │
│  │  analytics, settings                                     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Middleware:                                                    │
│  ├─ express.json()     → Parse JSON bodies                     │
│  ├─ cookieParser()     → Parse cookies                         │
│  └─ cors()             → Allow frontend origin                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ Mongoose ODM
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MongoDB                                  │
│                mongodb://127.0.0.1:27017/e-commerce            │
│                                                                 │
│  Collections:                                                   │
│  ├─ users         → {username, email, password(hash), role}    │
│  ├─ products      → {name, price, description, images, stock}  │
│  ├─ orders        → {user, items, total, status, shipping}     │
│  ├─ sellers       → Seller profile data                        │
│  ├─ reviews       → Product reviews                            │
│  ├─ wishlist      → User wishlists                             │
│  ├─ coupons       → Discount coupons                           │
│  └─ ...           → Other collections                          │
└─────────────────────────────────────────────────────────────────┘
```

## User Journey Flows

### 1. Customer Registration & Shopping

```
┌────────────┐
│  Open App  │
│    (/)     │
└─────┬──────┘
      │
      ▼
┌─────────────────────┐
│   Browse Products   │
│   (Public Access)   │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────┐      ┌─────────────────┐
│ Click "Add to Cart"  │─────▶│ User logged in? │
└──────────────────────┘      └────┬────────┬───┘
                                   │        │
                              YES  │        │ NO
                                   │        │
                                   ▼        ▼
                           ┌──────────┐  ┌────────────────┐
                           │ Add to   │  │ Alert & Redirect│
                           │ localStorage│ │  to /auth      │
                           └──────────┘  └───────┬────────┘
                                                  │
                                                  ▼
                                         ┌────────────────┐
                                         │  Auth Page     │
                                         │ Toggle Sign Up │
                                         └───────┬────────┘
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │ Fill form:      │
                                        │ - Username      │
                                        │ - Email         │
                                        │ - Password      │
                                        │ - Confirm Pass  │
                                        └────────┬────────┘
                                                 │
                                                 ▼
                                        ┌─────────────────────┐
                                        │ POST /api/auth/register│
                                        └──────────┬──────────┘
                                                   │
                                                   ▼
                                          ┌─────────────────┐
                                          │ JWT cookie set  │
                                          │ GET /api/auth/me│
                                          │ User in context │
                                          └────────┬────────┘
                                                   │
                                                   ▼
                                          ┌─────────────────┐
                                          │ Redirect to     │
                                          │   /account      │
                                          └─────────────────┘
```

### 2. Checkout & Order Flow

```
┌────────────────┐
│  Cart filled   │
│  (localStorage)│
└───────┬────────┘
        │
        ▼
┌────────────────┐      ┌──────────────┐
│ Click Checkout │─────▶│ Check login  │
└────────────────┘      └───┬──────┬───┘
                            │      │
                       YES  │      │ NO
                            │      │
                            ▼      ▼
                    ┌─────────┐ ┌────────────┐
                    │ Show    │ │ Redirect   │
                    │ Checkout│ │  to /auth  │
                    │  Page   │ └────────────┘
                    └────┬────┘
                         │
                         ▼
                ┌────────────────────┐
                │  Fill Shipping:    │
                │  - Name            │
                │  - Address         │
                │  - City            │
                │  - Postal Code     │
                │  - Payment Method  │
                └─────────┬──────────┘
                          │
                          ▼
                ┌───────────────────────┐
                │ Click Complete Purchase│
                └──────────┬────────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ POST /api/orders │
                  │  {user, items,   │
                  │   total, address}│
                  └────────┬─────────┘
                           │
                           ▼
                   ┌────────────────┐
                   │ Order created  │
                   │ Clear cart     │
                   └───────┬────────┘
                           │
                           ▼
                   ┌────────────────────┐
                   │ Redirect to        │
                   │/order-tracking/:id │
                   │                    │
                   │ Show delivery      │
                   │   timeline         │
                   └────────────────────┘
```

### 3. Seller Registration & Dashboard

```
┌─────────────────────┐
│ Go to /seller/register│
└──────────┬──────────┘
           │
           ▼
   ┌────────────────┐
   │ Fill form:     │
   │ - Username     │
   │ - Email        │
   │ - Password     │
   │ Role: 'seller' │
   └───────┬────────┘
           │
           ▼
   ┌───────────────────┐
   │ POST /api/auth/   │
   │  register         │
   │  role='seller'    │
   └────────┬──────────┘
            │
            ▼
    ┌────────────────┐
    │ JWT cookie set │
    │ User in context│
    └───────┬────────┘
            │
            ▼
    ┌───────────────────┐
    │ Redirect to /seller│
    └────────┬──────────┘
             │
             ▼
     ┌───────────────────┐
     │ Seller Dashboard  │
     │ - Revenue stats   │
     │ - Product grid    │
     │ - Performance     │
     └───────────────────┘
```

### 4. Admin Login & Dashboard

```
┌──────────────────┐
│ Run createAdmin.js│ (First time only)
└─────────┬────────┘
          │
          ▼
  ┌────────────────┐
  │ Admin created  │
  │ in MongoDB     │
  └───────┬────────┘
          │
          ▼
 ┌─────────────────┐
 │ Go to /admin/login│
 └────────┬────────┘
          │
          ▼
  ┌──────────────┐
  │ Fill form:   │
  │ - Username   │
  │ - Password   │
  └──────┬───────┘
         │
         ▼
 ┌───────────────────┐
 │ POST /api/auth/login│
 └────────┬──────────┘
          │
          ▼
  ┌────────────────┐
  │ JWT cookie set │
  │ User in context│
  └───────┬────────┘
          │
          ▼
  ┌──────────────────┐
  │ Redirect to /admin│
  └────────┬─────────┘
           │
           ▼
   ┌────────────────────┐
   │ Admin Dashboard    │
   │ - System stats     │
   │ - Top sellers      │
   │ - Activity logs    │
   │ - Generate reports │
   └────────────────────┘
```

### 5. Session Persistence

```
┌──────────────┐
│ User visits  │
│  any page    │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ App loads        │
│ AuthProvider mounts│
└──────┬───────────┘
       │
       ▼
┌────────────────────┐
│ GET /api/auth/me   │
│ (with cookie)      │
└──────┬─────────────┘
       │
       ├─────────────┬─────────────┐
       │             │             │
       ▼             ▼             ▼
┌───────────┐  ┌─────────────┐  ┌──────────┐
│ 200 OK    │  │ 401 Unauth  │  │ Network  │
│ Return    │  │ No/Invalid  │  │  Error   │
│ user data │  │  cookie     │  │          │
└─────┬─────┘  └──────┬──────┘  └─────┬────┘
      │               │                │
      ▼               ▼                ▼
┌─────────────┐  ┌──────────────┐  ┌──────────┐
│ setUser(data)│  │ setUser(null)│  │setUser(null)│
└──────┬──────┘  └──────┬───────┘  └─────┬────┘
       │                │                 │
       │                │                 │
       └────────────────┴─────────────────┘
                        │
                        ▼
                ┌────────────────┐
                │ setLoading(false)│
                └────────┬───────┘
                         │
                         ▼
                 ┌────────────────┐
                 │ App renders    │
                 │ with user state│
                 └────────────────┘
```

## Data Flow

### Adding to Cart

```
Product Page
    │
    ├─ Click "Add to Cart"
    │
    ├─ Check: user from useAuth()
    │
    ├─ If NOT logged in:
    │   └─ Alert "Please login"
    │   └─ navigate('/auth')
    │
    └─ If logged in:
        └─ Get cart from localStorage
        └─ Add/Update item
        └─ Save back to localStorage
        └─ Alert "Added to cart!"
```

### Creating Order

```
Checkout Page
    │
    ├─ Load cart from localStorage
    ├─ Display items, calculate total
    │
    ├─ User fills shipping form
    │
    ├─ Click "Complete Purchase"
    │
    ├─ Validate form data
    │
    ├─ Prepare payload:
    │   {
    │     user: user._id,
    │     username: user.username,
    │     items: [{ product, quantity, price, name }],
    │     total: calculatedTotal,
    │     status: 'pending',
    │     shippingAddress: { address, city, zipCode }
    │   }
    │
    ├─ POST /api/orders (with credentials: 'include')
    │
    └─ Backend:
        ├─ Validate user exists
        ├─ Create Order document
        ├─ Save to MongoDB
        └─ Return order object
        
Frontend:
    ├─ Clear cart from localStorage
    ├─ Alert "Order placed!"
    └─ navigate(`/order-tracking/${order._id}`)
```

## Authentication States

```
┌──────────────────────────────────────────────────────────────┐
│                     AuthContext State                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  loading: true | false                                       │
│    - true:  Initial load, checking session                   │
│    - false: Session check complete                           │
│                                                              │
│  user: null | { _id, username, email, role, ... }           │
│    - null:   Not logged in                                   │
│    - object: Logged in, user data available                  │
│                                                              │
│  Functions:                                                  │
│  ├─ login(username, password)                                │
│  │   → POST /api/auth/login                                  │
│  │   → Set cookie, fetch user, update state                  │
│  │                                                           │
│  ├─ register(username, email, password, role)                │
│  │   → POST /api/auth/register                               │
│  │   → Set cookie, fetch user, update state                  │
│  │                                                           │
│  └─ logout()                                                 │
│      → POST /api/auth/logout                                 │
│      → Clear cookie, set user to null                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Protected Route Logic

```
Component Render
    │
    ├─ PrivateRoute wrapper
    │   └─ const { user, loading } = useAuth()
    │   └─ if (loading) return null
    │   └─ if (!user) return <Navigate to="/auth" />
    │   └─ return children
    │
    └─ RoleRoute wrapper
        └─ const { user, loading } = useAuth()
        └─ if (loading) return null
        └─ if (!user) return <Navigate to="/auth" />
        └─ if (!roles.includes(user.role)) return <Navigate to="/" />
        └─ return children
```

## Complete Route Map

```
┌─────────────────────────────────────────────────────────┐
│                    Public Routes                        │
├─────────────────────────────────────────────────────────┤
│ /                         → Home (product browsing)     │
│ /product/:id              → Product Detail              │
│ /auth, /login, /register  → Customer Auth               │
│ /seller/login             → Seller Login                │
│ /seller/register          → Seller Register             │
│ /admin/login              → Admin Login                 │
│ /categories               → Category Browse             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                Protected Routes (any user)              │
├─────────────────────────────────────────────────────────┤
│ /checkout               → Checkout (cart summary)       │
│ /order-tracking/:id?    → Order Tracking               │
│ /account                → User Account Page             │
│ /seller                 → Seller Dashboard              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              Role-Protected Routes                      │
├─────────────────────────────────────────────────────────┤
│ /admin  → Admin Dashboard (role: 'admin' only)         │
└─────────────────────────────────────────────────────────┘
```

---

**Diagram Legend:**
- `→` : Navigation/Flow direction
- `├─` : Branch/Option
- `└─` : End of branch
- `▼` : Downward flow
- `┌──┐` : Box/Container

This visual guide shows all the flows and connections in your e-commerce application! 🚀
