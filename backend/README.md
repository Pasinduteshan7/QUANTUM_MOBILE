# Quantum Mobile & Quick Store - Enterprise MERN Backend

Production-ready Node.js, Express, and MongoDB backend for the Quantum Mobile / Quick flagship smartphone and accessories e-commerce store.

---

## 🏛️ Enterprise Spring Boot Architecture Translated to MERN

This backend incorporates the design patterns from enterprise Spring Boot backends, adapted for maximum performance and scalability in Node.js and MongoDB:

| Spring Boot Concept | Node.js + Express + MongoDB Equivalent | Implementation Location |
| :--- | :--- | :--- |
| **`@RestController` & Routing** | Express Modular Routers | `backend/routes/` (`authRoutes.js`, `productRoutes.js`, `cartRoutes.js`, `orderRoutes.js`) |
| **`@Service` & Business Logic** | Specialized Controllers | `backend/controllers/` (`authController.js`, `cartController.js`, etc.) |
| **Spring Data JPA / `@Entity`** | Mongoose Schemas & Models | `backend/models/` (`User.js`, `Product.js`, `Cart.js`, `Order.js`) |
| **Spring Security / `SecurityFilterChain`** | JWT Verification Middleware | `backend/middleware/authMiddleware.js` (`protect`, `admin`) |
| **`@ControllerAdvice` Global Errors** | Express Centralized Error Middleware | `backend/middleware/errorMiddleware.js` (`errorHandler`, `notFound`) |
| **`ResponseEntity<ApiResponse<T>>`** | Standardized JSON Envelope Utility | `backend/utils/apiResponse.js` (`sendSuccess`, `sendError`) |
| **`CommandLineRunner` / `data.sql`** | One-Click Database Seeder Script | `backend/seeder.js` (`npm run seed`) |
| **Jakarta Validation (`@Valid`)** | Mongoose Schema-Level Validation | Regex emails, min/max bounds, required field constraints |

---

## 🛡️ Core Business Rule: Public Browsing vs. Protected Cart

* **Public Browsing:** Anyone can browse the website, view hero banners, search the catalog, filter brands (Apple, Samsung, Google, etc.), view device specifications, and inspect finishes without logging in.
* **Protected Cart & Profile:** Adding items to cart, viewing cart, updating quantities, checkout, and managing delivery addresses **strictly require a logged-in user with a valid JWT token**. Attempting to add an item to the cart without being logged in returns a clean `401 Unauthorized` response instructing the client to prompt for login.

---

## 📁 Directory Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection using Mongoose
├── controllers/
│   ├── authController.js     # User registration, login, profile view & update
│   ├── productController.js  # Public catalog search, filter, brand queries & admin CRUD
│   ├── cartController.js     # User-specific persistent cart management
│   └── orderController.js    # Checkout, customer order history, PayHere webhook
├── middleware/
│   ├── authMiddleware.js     # JWT protection & role-based access control
│   ├── errorMiddleware.js    # Global exception handler
│   └── uploadMiddleware.js   # Multer file upload handler
├── models/
│   ├── User.js               # User accounts with bcrypt password hashing
│   ├── Product.js            # Products with specs, finishes, and text search indexes
│   ├── Cart.js               # Persistent cart with auto-calculated subtotals
│   └── Order.js              # Order records with payment status and delivery tracking
├── routes/
│   ├── authRoutes.js         # /api/auth endpoints
│   ├── productRoutes.js      # /api/products endpoints
│   ├── cartRoutes.js         # /api/cart endpoints (Protected)
│   └── orderRoutes.js        # /api/orders endpoints (Protected)
├── utils/
│   ├── apiResponse.js        # Standardized JSON response envelope
│   └── generateToken.js      # JWT signing utility
├── seeder.js                 # Pre-populates MongoDB with users & flagships
├── server.js                 # Main Express server entry point
└── package.json              # Backend dependencies and scripts
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment (`.env`)
Make sure `.env` is configured with your MongoDB URI:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/quantum_mobile
JWT_SECRET=quantum_mobile_jwt_super_secure_key_2026_lk
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5174
```

### 3. Seed Initial Data (Optional)
Populate your database with sample phones, watches, chargers, and users:
```bash
npm run seed
```
* **Sample Admin:** `admin@quick.lk` / `password123`
* **Sample Customer:** `kasun@gmail.com` / `password123`

### 4. Start Server
* **Production mode:** `npm start`
* **Development mode (auto-reload):** `npm run dev`

The server runs on **`http://localhost:5000/api`**.

---

## 📡 API Endpoints Overview

### Authentication (`/api/auth`)
* `POST /api/auth/register` - Create user account
* `POST /api/auth/login` - Authenticate & obtain JWT
* `GET  /api/auth/profile` - View user profile *(Requires JWT)*
* `PUT  /api/auth/profile` - Update user delivery address *(Requires JWT)*

### Products (`/api/products`) - Public
* `GET  /api/products` - Search, filter by brand, category, price range, sort
* `GET  /api/products/:id` - View single product details
* `GET  /api/products/brand/:brand` - View all products for an ecosystem (e.g. `apple`, `samsung`)
* `GET  /api/products/featured` - View featured hero products

### Cart (`/api/cart`) - Requires Login
* `GET    /api/cart` - View user's persistent cart
* `POST   /api/cart/add` - Add item to cart
* `PUT    /api/cart/item/:itemId` - Update quantity
* `DELETE /api/cart/item/:itemId` - Remove item
* `DELETE /api/cart` - Clear entire cart

### Orders (`/api/orders`) - Requires Login
* `POST /api/orders` - Checkout and place order
* `GET  /api/orders/my-orders` - View past orders
* `GET  /api/orders/:id` - View specific order
* `POST /api/orders/payhere-notify` - PayHere Sri Lanka IPN webhook callback
