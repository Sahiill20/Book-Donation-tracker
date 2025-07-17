import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader"; 

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Always run hooks first, then handle conditional rendering
  if (loading) {
    return <Loader />
  }

  return currentUser ? children : <Navigate to="/Login" replace />;
}
