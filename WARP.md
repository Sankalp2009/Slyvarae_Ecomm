# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Shopsy is a full-stack e-commerce application with a REST API backend and React frontend. The project uses a monorepo structure with separate `server` and `client` directories.

**Stack:**
- **Backend:** Node.js, Express 5.x, MongoDB with Mongoose
- **Frontend:** React 19, Vite, Chakra UI v3, Redux (legacy), React Router 7
- **Testing:** Jest (server), Vitest (client)
- **Authentication:** JWT-based with role-based access control (RBAC)

## Common Commands

### Server (Backend)
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Development (with nodemon auto-reload)
npm start

# Production mode
npm run dev

# Run tests
npm test

# Seed super admin account (requires env vars)
npm run seed
```

### Client (Frontend)
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Development server (runs on port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

```

## Architecture

### Server Architecture

**MVC Pattern with Layered Structure:**

- **`Model/`** - Mongoose schemas and models
  - `userModel.js` - User schema with bcrypt password hashing pre-save hook
  - `productModel.js` - Product schema with text indexes for search

- **`Controller/`** - Business logic and request handlers
  - `userController.js` - Handles register, login, token refresh
  - `productController.js` - CRUD operations for products

- **`Routes/`** - Express route definitions
  - `userRoutes.js` - Auth endpoints under `/api/v1/users`
  - `productRoutes.js` - Product endpoints under `/api/v1/Products`

- **`Middleware/`** - Request processing middleware
  - `Protected.js` - JWT verification and role-based authorization (`Protected` middleware and `restrictTo()` factory)

- **`Utils/`** - Utility classes and helpers
  - `ApiFeature.js` - Query builder class for search, filter, sort, pagination
  - `jwt.js` - JWT token generation and verification utilities
  - `rateLimiter.js` - Rate limiting configurations (`generalLimiter`, `authLimit`)
  - `IsValidObject.js` - MongoDB ObjectId validation helper

- **`__tests__/`** - Jest test suites
  - Uses `node-mocks-http` and `supertest` for API testing

**Key Architectural Patterns:**
- JWT tokens are issued on registration/login and stored in both response body and HTTP-only cookies
- Role-based access: `user` (default) and `admin` roles
- All admin operations (create/update/delete products) require `Protected` + `restrictTo("admin")`
- Rate limiting: general API (100 req/10min), auth endpoints (5 req/10min)
- Graceful shutdown handling for SIGTERM/SIGINT signals
- Database connection with exponential backoff retry logic

### Client Architecture

**React + Redux Architecture:**

- **`Redux/`** - State management with legacy Redux (no toolkit)
  - `store.jsx` - Root store with localStorage persistence (throttled saves)
  - Feature-based reducers: `Auth_Reducer`, `Product_Reducer`, `Cart_Reducer`, `Order_Reducer`
  - Each reducer folder has `action.jsx` (action types) and `reducer.jsx`
  - Redux DevTools enabled in development

- **`Pages/`** - Route-level components
  - `Home.jsx` - Landing page
  - `Auth/` - Login, Register pages
  - `Customer/` - Product, ProductDetail, Cart, Checkout, Order, Profile
  - `Admin.jsx` - Admin dashboard

- **`Component/`** - Shared components
  - `AllRoutes.jsx` - React Router route configuration with lazy loading
  - `Header.jsx` - Navigation header
  - `ProductCard.jsx`, `CartItem.jsx`, `FilterSidebar.jsx`
  - `ErrorBoundary.jsx` - Error catching boundary
  - `LoadingFallback.jsx` - Suspense fallback UI

- **`components/ui/`** - Chakra UI components (using v3 architecture)

- **`Utils/`** - Route guards
  - `ProtectedRoute.jsx` - Requires authentication
  - `AdminRoute.jsx` - Requires admin role

**Key Client Patterns:**
- All pages are lazy-loaded with React.lazy() and Suspense
- Redux state persisted to localStorage (auth, cart, order)
- State clears on logout automatically
- Protected routes redirect unauthenticated users
- Admin routes redirect non-admin users

## Development Guidelines

### Backend Development

**When modifying authentication/authorization:**
- JWT secret is stored in `JWT_SECRET_KEY` environment variable
- Tokens are verified in `Protected` middleware - never bypass this
- Use `restrictTo("admin")` factory for admin-only routes
- Token errors are categorized: `TOKEN_EXPIRED`, `INVALID_TOKEN`, `USER_NOT_FOUND`

**When working with products:**
- Product queries use `ApiFeature` class for consistent filtering/sorting
- Chain methods: `.search().filter().sort().limitFields().paginate().exec()`
- Text search is regex-based on: name, description, category, brand
- Support multi-category filtering: `?category=Electronics&category=Computers`
- Operators: `price[gte]`, `price[lte]`, `stock[gt]`, etc.

**When adding new routes:**
- Apply `Protected` middleware for authenticated routes
- Use `restrictTo(...roles)` after `Protected` for role restrictions
- Consider rate limiting via `Utils/rateLimiter.js`
- Follow existing error response format: `{ status: "fail/error", message: "...", code: "..." }`

**Database models:**
- User password field has `select: false` in queries by default
- Both models use timestamps and `versionKey: false`
- Product model has compound text index for search performance

### Frontend Development

**When working with Redux:**
- Action types are defined in `action.jsx` files as constants
- Reducers follow standard pattern: `(state, action) => newState`
- Use `useSelector` for reading state, `useDispatch` for actions
- State persistence is automatic via store subscription

**When adding new pages:**
- Create component in appropriate `Pages/` subdirectory
- Use lazy loading: `const NewPage = lazy(() => import("./Pages/NewPage.jsx"))`
- Add route in `AllRoutes.jsx` with appropriate guards
- Wrap with `<ProtectedRoute>` or `<AdminRoute>` if needed

**When working with API calls:**
- API calls should be made in Redux action creators (not in components directly)
- Base URL is environment-dependent: production or `http://localhost:8080`
- Auth token should be sent in `Authorization: Bearer <token>` header
- Token is stored in Redux state at `state.auth.access_token`

**Chakra UI v3 considerations:**
- Uses new architecture with `Provider` from `components/ui/provider.jsx`
- Imports from `@chakra-ui/react`
- Theme provider is `next-themes` for light/dark mode support

### Client
- No environment variables are currently required
- API URL is hardcoded based on NODE_ENV in server CORS config
- Production: `https://slyvarae-ecomm-eight.vercel.app`
- Development: `http://localhost:5173`

## API Endpoints

**Base URL:** `/api/v1`

**Authentication (no auth required):**
- POST `/users/register` - Create account
- POST `/users/login` - Get JWT token (rate limited: 5/10min)
- POST `/users/refreshToken` - Refresh token (requires auth)

**Products:**
- GET `/Products` - List products (public, supports query params)
- GET `/Products/:id` - Get single product (requires auth)
- POST `/Products` - Create product(s) (admin only, accepts array)
- PUT/PATCH `/Products/:id` - Update product (admin only)
- DELETE `/Products/:id` - Delete product (admin only)

**Query Parameters for GET /Products:**
- `search` - Text search across name/description/category/brand
- `category` - Filter by category (supports multiple)
- `brand` - Filter by brand
- `price[gte]`, `price[lte]` - Price range
- `stock[gt]`, `stock[lt]` - Stock filters
- `sort` - Sort fields (comma-separated, prefix `-` for desc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

## Testing

### Server Tests
- Test files in `__tests__/` directory
- Run with: `npm test` (requires `--experimental-vm-modules` flag)
- Uses Jest with Babel transform for ES modules
- Setup file at `__tests__/setup.js`

## Important Notes

**Security:**
- Never commit `config.env` files - they contain secrets
- Passwords are hashed with bcrypt (10 salt rounds) before storage
- JWT tokens expire based on configured duration
- HTTP-only cookies used for token storage in addition to response body
- Helmet.js provides security headers
- HPP prevents parameter pollution

**Performance:**
- Server uses compression middleware
- Client uses code splitting via Vite's manual chunks
- Console logs dropped in production builds (esbuild config)
- MongoDB indexes on frequently queried fields
- Redux saves throttled to max once per second

**Deployment:**
- Server deployed on Render: `https://slyvarae-ecomm.onrender.com`
- Client deployed on Vercel: `https://slyvarae-ecomm-eight.vercel.app`
- Server trusts proxy for correct IP detection behind reverse proxies

**Windows-Specific:**
- This repo is on Windows (PowerShell environment)
- Use PowerShell commands: `Get-ChildItem` instead of `ls -la`
- Line endings are CRLF (`\r\n`)
