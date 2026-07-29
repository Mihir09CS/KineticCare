import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Spinner from "../components/common/Spinner.jsx";

const RoleGuard = ({ children, allowedRole = "ADMIN" }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" label="Checking permissions..." />
      </div>
    );
  }

  if (user?.role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleGuard;
