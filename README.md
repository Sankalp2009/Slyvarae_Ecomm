# Sylvarae API Documentation

## Table of Contents
- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
  - [User Authentication](#user-authentication)
  - [Product Management](#product-management)
- [Error Handling](#error-handling)
- [Security Features](#security-features)

---

## Overview

Sylvarae is a full-featured e-commerce REST API built with Node.js, Express, and MongoDB. It provides comprehensive functionality for user authentication, product management, and role-based access control.

**Technology Stack:**
- **Runtime:** Node.js
- **Framework:** Express 5.x
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, HPP, bcryptjs, XSS protection
- **Rate Limiting:** express-rate-limit

---

## Base URL

```
Production: https://slyvarae-ecomm.onrender.com
Development: http://localhost:8080
```

All API endpoints are prefixed with `/api/v1` unless otherwise specified.

---

## Authentication

The API uses JWT (JSON Web Token) based authentication. After successful login or registration, you'll receive a token that must be included in subsequent requests.

### Token Usage

Include the token in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

### Token Storage

Tokens are also stored in HTTP-only cookies (`jwt` cookie) for additional security.

---

## Rate Limiting

### General Rate Limit
- **Window:** 10 minutes
- **Limit:** 100 requests per IP
- **Response:** `429 Too Many Requests`

### Authentication Rate Limit (Login)
- **Window:** 10 minutes
- **Limit:** 5 attempts per IP
- **Response:** `429 Too Many Requests`
- **Note:** Successful requests are not counted

---

## API Endpoints

### User Authentication

#### 1. Register User

Create a new user account.

**Endpoint:** `POST /api/v1/users/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "photo": "https://example.com/photo.jpg" // Optional
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "User registered successfully.",
  "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "User": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "photo": "https://example.com/photo.jpg",
    "createdAt": "2025-10-24T10:30:00.000Z",
    "updatedAt": "2025-10-24T10:30:00.000Z"
  }
}
```

**Error Responses:**

*400 Bad Request - Missing Fields:*
```json
{
  "status": "fail",
  "message": "Please provide all required fields: name, email, and password."
}
```

*400 Bad Request - User Exists:*
```json
{
  "status": "fail",
  "message": "User already exists with this email."
}
```

*400 Bad Request - Reserved Email:*
```json
{
  "status": "fail",
  "message": "This email is reserved. Please use a different email."
}
```

---

#### 2. Login User

Authenticate and receive a JWT token.

**Endpoint:** `POST /api/v1/users/login`

**Rate Limited:** 5 attempts per 10 minutes

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "User": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "photo": "https://example.com/photo.jpg",
    "createdAt": "2025-10-24T10:30:00.000Z",
    "updatedAt": "2025-10-24T10:30:00.000Z"
  }
}
```

**Error Responses:**

*400 Bad Request - Missing Credentials:*
```json
{
  "status": "fail",
  "message": "Please provide both email and password."
}
```

*401 Unauthorized - Invalid Credentials:*
```json
{
  "status": "fail",
  "message": "Invalid email or password."
}
```

---

#### 3. Refresh Token

Generate a new token using an existing valid token.

**Endpoint:** `POST /api/v1/users/refreshToken`

**Headers:**
```
Authorization: Bearer <current_token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "User": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

*401 Unauthorized - No Token:*
```json
{
  "status": "fail",
  "message": "You are not logged in"
}
```

*401 Unauthorized - User Not Found:*
```json
{
  "status": "fail",
  "message": "User no longer exists"
}
```

---

### Product Management

All product management endpoints (except listing all products) require authentication.

#### 1. Get All Products

Retrieve a paginated list of products with search, filter, and sort capabilities.

**Endpoint:** `GET /api/v1/Products`

**Authentication:** Not required

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Text search across name, description, category, brand | `?search=laptop` |
| `category` | string | Filter by category (supports multiple) | `?category=Electronics` |
| `brand` | string | Filter by brand | `?brand=Apple` |
| `price[gte]` | number | Minimum price | `?price[gte]=100` |
| `price[lte]` | number | Maximum price | `?price[lte]=1000` |
| `stock[gt]` | number | Stock greater than | `?stock[gt]=0` |
| `sort` | string | Sort fields (comma-separated, prefix `-` for desc) | `?sort=-price,name` |
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (default: 10) | `?limit=20` |

**Example Requests:**

```
# Search for laptops
GET /api/v1/Products?search=laptop

# Filter by category and price range
GET /api/v1/Products?category=Electronics&price[gte]=500&price[lte]=2000

# Sort by price descending, page 2, 20 items per page
GET /api/v1/Products?sort=-price&page=2&limit=20

# Multiple categories
GET /api/v1/Products?category=Electronics&category=Computers
```

**Success Response (200):**
```json
{
  "status": "success",
  "result": 15,
  "message": "List of all products",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "MacBook Pro 16",
      "description": "Powerful laptop for professionals",
      "price": 2499.99,
      "category": "Electronics",
      "brand": "Apple",
      "stock": 25,
      "image": "https://example.com/macbook.jpg",
      "createdAt": "2025-10-20T10:30:00.000Z",
      "updatedAt": "2025-10-24T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalProducts": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Empty Response (200):**
```json
{
  "status": "success",
  "result": 0,
  "message": "No products found",
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 0,
    "totalProducts": 0,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

#### 2. Get Product by ID

Retrieve a single product by its ID.

**Endpoint:** `GET /api/v1/Products/:id`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the product

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Product retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "MacBook Pro 16",
    "description": "Powerful laptop for professionals",
    "price": 2499.99,
    "category": "Electronics",
    "brand": "Apple",
    "stock": 25,
    "image": "https://example.com/macbook.jpg",
    "createdAt": "2025-10-20T10:30:00.000Z",
    "updatedAt": "2025-10-24T10:30:00.000Z"
  }
}
```

**Error Responses:**

*400 Bad Request - Invalid ID:*
```json
{
  "status": "fail",
  "message": "Invalid product ID format"
}
```

*404 Not Found:*
```json
{
  "status": "fail",
  "message": "Product not found"
}
```

---

#### 3. Create Product(s)

Create one or multiple products (Admin only).

**Endpoint:** `POST /api/v1/Products`

**Authentication:** Required (Admin role)

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body (Single Product):**
```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest flagship smartphone from Apple",
  "price": 999.99,
  "category": "Electronics",
  "brand": "Apple",
  "stock": 50,
  "image": "https://example.com/iphone15.jpg"
}
```

**Request Body (Multiple Products):**
```json
[
  {
    "name": "iPhone 15 Pro",
    "description": "Latest flagship smartphone",
    "price": 999.99,
    "category": "Electronics",
    "brand": "Apple",
    "stock": 50,
    "image": "https://example.com/iphone15.jpg"
  },
  {
    "name": "AirPods Pro",
    "description": "Premium wireless earbuds",
    "price": 249.99,
    "category": "Audio",
    "brand": "Apple",
    "stock": 100,
    "image": "https://example.com/airpods.jpg"
  }
]
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "2 product(s) created successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "iPhone 15 Pro",
      "description": "Latest flagship smartphone",
      "price": 999.99,
      "category": "Electronics",
      "brand": "Apple",
      "stock": 50,
      "image": "https://example.com/iphone15.jpg",
      "createdAt": "2025-10-24T10:30:00.000Z",
      "updatedAt": "2025-10-24T10:30:00.000Z"
    }
  ]
}
```

**Error Responses:**

*400 Bad Request - Missing Fields:*
```json
{
  "status": "fail",
  "message": "Some products are missing required fields (name, description, price, category, brand, stock, image)"
}
```

*400 Bad Request - Duplicate Product:*
```json
{
  "status": "fail",
  "message": "Duplicate product(s) found: iPhone 15 Pro"
}
```

*403 Forbidden - Not Admin:*
```json
{
  "status": "fail",
  "message": "Access denied. This action requires one of the following roles: admin. Your role: user",
  "code": "INSUFFICIENT_PERMISSIONS",
  "requiredRoles": ["admin"],
  "userRole": "user"
}
```

---

#### 4. Update Product

Update an existing product (Admin only).

**Endpoint:** `PUT /api/v1/Products/:id` or `PATCH /api/v1/Products/:id`

**Authentication:** Required (Admin role)

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the product

**Request Body (Partial Update Supported):**
```json
{
  "price": 899.99,
  "stock": 75,
  "description": "Updated description"
}
```

**Allowed Fields:**
- `name`
- `description`
- `price`
- `category`
- `brand`
- `stock`
- `image`

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Product updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "iPhone 15 Pro",
    "description": "Updated description",
    "price": 899.99,
    "category": "Electronics",
    "brand": "Apple",
    "stock": 75,
    "image": "https://example.com/iphone15.jpg",
    "createdAt": "2025-10-20T10:30:00.000Z",
    "updatedAt": "2025-10-24T11:45:00.000Z"
  }
}
```

**Error Responses:**

*400 Bad Request - Invalid ID:*
```json
{
  "status": "fail",
  "message": "Invalid product ID format"
}
```

*400 Bad Request - No Valid Fields:*
```json
{
  "status": "fail",
  "message": "No valid fields to update"
}
```

*400 Bad Request - Invalid Data:*
```json
{
  "status": "fail",
  "message": "Price must be a valid positive number"
}
```

*404 Not Found:*
```json
{
  "status": "fail",
  "message": "Product not found"
}
```

---

#### 5. Delete Product

Delete a product permanently (Admin only).

**Endpoint:** `DELETE /api/v1/Products/:id`

**Authentication:** Required (Admin role)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the product

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Product deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "iPhone 15 Pro"
  }
}
```

**Error Responses:**

*400 Bad Request - Invalid ID:*
```json
{
  "status": "fail",
  "message": "Invalid product ID format"
}
```

*404 Not Found:*
```json
{
  "status": "fail",
  "message": "Product not found"
}
```

---

## Error Handling

### Authentication Errors

**401 Unauthorized - No Token:**
```json
{
  "status": "fail",
  "message": "Access denied. No authorization header provided.",
  "code": "NO_AUTH_HEADER"
}
```

**401 Unauthorized - Invalid Token Format:**
```json
{
  "status": "fail",
  "message": "Invalid authorization format. Expected format: 'Bearer <token>'",
  "code": "INVALID_AUTH_FORMAT"
}
```

**401 Unauthorized - Token Expired:**
```json
{
  "status": "fail",
  "message": "Token has expired. Please log in again to get a new token.",
  "code": "TOKEN_EXPIRED",
  "expiredAt": "2025-10-24T10:30:00.000Z"
}
```

**401 Unauthorized - Invalid Token:**
```json
{
  "status": "fail",
  "message": "Invalid token. The token is malformed or has been tampered with.",
  "code": "INVALID_TOKEN"
}
```

**401 Unauthorized - User Not Found:**
```json
{
  "status": "fail",
  "message": "The user belonging to this token no longer exists. Please log in again.",
  "code": "USER_NOT_FOUND"
}
```

### Authorization Errors

**403 Forbidden - Insufficient Permissions:**
```json
{
  "status": "fail",
  "message": "Access denied. This action requires one of the following roles: admin. Your role: user",
  "code": "INSUFFICIENT_PERMISSIONS",
  "requiredRoles": ["admin"],
  "userRole": "user"
}
```

### General Errors

**404 Not Found:**
```json
{
  "status": "fail",
  "message": "Route not found"
}
```

**429 Too Many Requests:**
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

**500 Internal Server Error:**
```json
{
  "status": "error",
  "message": "Internal server error",
  "error": "Detailed error message"
}
```

---

## Security Features

### 1. Password Security
- Passwords are hashed using bcryptjs with salt rounds of 10
- Passwords are never returned in API responses
- Password stored in database are irreversibly encrypted

### 2. HTTP Security Headers
- Helmet.js implemented for secure HTTP headers
- Cross-Origin Resource Policy enabled
- XSS protection enabled

### 3. CORS Configuration
- Configured for production domain: `https://sylvarae-ecomm-eight.vercel.app`
- Credentials enabled for cookie-based authentication
- Restricted methods: GET, POST, PUT, PATCH, DELETE

### 4. Rate Limiting
- General API: 100 requests per 10 minutes
- Authentication: 5 attempts per 10 minutes
- IP-based tracking with trust proxy enabled

### 5. Input Validation
- HPP (HTTP Parameter Pollution) prevention
- Request body size limited to 10MB
- URL-encoded data parsing with limit
- MongoDB ObjectId validation
- Sanitized update operations with whitelisted fields

### 6. Token Security
- JWT tokens with configurable expiration
- HTTP-only cookies for token storage
- Secure cookie options in production
- Token verification on every protected route

### 7. Role-Based Access Control (RBAC)
- User roles: `user`, `admin`
- Protected routes with middleware
- Role-specific route restrictions
- Super admin seeding via environment variables

---

## Database Schema

### User Schema

```javascript
{
  name: String (required),
  email: String (required, unique, trimmed, lowercase),
  password: String (required, hashed, select: false),
  role: String (enum: ["user", "admin"], default: "user"),
  photo: String (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Product Schema

```javascript
{
  name: String (required, 2-100 chars, trimmed),
  description: String (required, min 10 chars, trimmed),
  price: Number (required, min: 0, rounded to 2 decimals),
  category: String (required, trimmed, indexed),
  brand: String (default: "Generic", trimmed, indexed),
  stock: Number (required, min: 0, default: 0, rounded),
  image: String (default: ""),
  createdAt: Date (auto-generated, indexed descending),
  updatedAt: Date (auto-generated)
}
```

**Indexes:**
- Text index on: name, description, category, brand
- Single indexes on: price, category, brand, createdAt

---

## Environment Variables

Required environment variables for the API:

```env
# Database
DATABASE_URI=mongodb+srv://...

# JWT
JWT_SECRET_KEY=your-secret-key-here

# Super Admin (for seeding) | Admin Access
SUPER_ADMIN_EMAIL=admin@sylvarae.com
SUPER_ADMIN_PASSWORD=admin123
SUPER_ADMIN_NAME=Super Admin

# Environment
NODE_ENV=production
```

```
## Setup and Deployment

### Installation

```bash
cd server
npm install
```

### Running Locally

```bash
# Development mode with nodemon
npm start

# Production mode
npm run dev
```

### Seeding Super Admin

```bash
npm run seed
```

This creates the admin account from environment variables.

---

## Health Check

**Endpoint:** `GET /health`

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-10-24T10:30:00.000Z"
}
```

---

## Best Practices for API Consumption

1. **Always include Authorization header** for protected routes
2. **Handle token expiration** gracefully and use refresh token endpoint
3. **Implement retry logic** for rate-limited requests
4. **Validate input** on the client side before sending requests
5. **Cache GET requests** where appropriate (5-minute cache control set)
6. **Use pagination** for product listings to improve performance
7. **Implement proper error handling** for all error codes
8. **Store tokens securely** (use httpOnly cookies or secure storage)
9. **Don't expose sensitive data** in error messages
10. **Use HTTPS** in production environments

---

## Support and Contact

For issues, questions, or feature requests:
- Check the API health endpoint first: `GET /health`
- Review this documentation thoroughly

**API Version:** 1.0.0  

```
Maintainer: Sankalp Patel

Project Repo: Sylvarae E-commerce API

Deployed API: https://slyvarae-ecomm.onrender.com

© 2025 Sylvarae API — Built with ❤️ using Node.js, Express & MongoDB
```