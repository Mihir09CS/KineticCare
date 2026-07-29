import { Link } from "react-router-dom";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import Button from "../../components/common/Button.jsx";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Page Not Found</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            The wellness page or service you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link to="/">
            <Button variant="primary" fullWidth className="gap-2">
              <Home className="w-4 h-4" />
              Go to Home
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button variant="outline" fullWidth className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
