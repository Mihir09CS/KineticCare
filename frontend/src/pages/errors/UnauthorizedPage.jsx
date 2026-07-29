import { Link } from "react-router-dom";
import { ShieldAlert, Home, LayoutDashboard } from "lucide-react";
import Button from "../../components/common/Button.jsx";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl border border-red-100 shadow-xl">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Access Restricted</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            You do not have administrative permissions to view this resource.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link to="/dashboard">
            <Button variant="primary" fullWidth className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              User Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" fullWidth className="gap-2">
              <Home className="w-4 h-4" />
              Home Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
