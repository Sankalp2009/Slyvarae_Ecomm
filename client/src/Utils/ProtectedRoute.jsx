import { useSelector } from "react-redux";
import { Navigate } from "react-router";

function ProtectedRoute({ children }) {
  const { access_token, user, IsAuth } = useSelector((state) => state.auth);

  if (!IsAuth || !access_token || !user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default ProtectedRoute;
