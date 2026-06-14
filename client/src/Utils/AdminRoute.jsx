import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const AdminRoute = ({ children }) => {
  const { user, IsAuth, access_token } = useSelector((state) => state.auth);

  if (!IsAuth || !access_token || !user) {
    return <Navigate to="/signin" replace />;
  }

  if (user.role !== "admin" && user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
