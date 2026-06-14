import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router";
import AdminRoute from "../Utils/AdminRoute.jsx";
import ProtectedRoute from "../Utils/ProtectedRoute.jsx";
import LoadingFallback from "./LoadingFallback.jsx";

// Lazy load all page components
const Home = lazy(() => import("../Pages/Home.jsx"));
const Login = lazy(() => import("../Pages/Auth/Login.jsx"));
const Register = lazy(() => import("../Pages/Auth/Register.jsx"));
const Product = lazy(() => import("../Pages/Customer/Product.jsx"));
const ProductDetail = lazy(() => import("../Pages/Customer/ProductDetail.jsx"));
const Checkout = lazy(() => import("../Pages/Customer/Checkout.jsx"));
const Profile = lazy(() => import("../Pages/Customer/Profile.jsx"));
const Cart = lazy(() => import("../Pages/Customer/Cart.jsx"));
const Order = lazy(() => import("../Pages/Customer/Order.jsx"));
const Admin = lazy(() => import("../Pages/Admin.jsx"));

function AllRoutes() {
  const { user, IsAuth } = useSelector((state) => state.auth);

  return (
    <Suspense fallback={<LoadingFallback message="Loading page..." />}>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />

        {/* Auth Route Public*/}
        <Route
          path="/signin"
          element={
            IsAuth ? (
              user?.role === "admin" || user?.role === "Admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route path="/signup" element={<Register />} />

        {/* Product Route Public */}
        <Route
          path="/product"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />

        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />

        {/* Cart Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Order page User */}
        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />

        {/* Checkout  */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* Admin  */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default AllRoutes;
