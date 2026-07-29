import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

// Create TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            gutter={12}
            containerStyle={{ top: 72 }}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#0f172a",
                color: "#f8fafc",
                borderRadius: "14px",
                fontSize: "14px",
                fontWeight: "500",
                padding: "12px 16px",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)",
                border: "1px solid rgba(255,255,255,0.06)",
                maxWidth: "380px",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#0f172a",
                },
                style: {
                  background: "#0f172a",
                  borderLeft: "3px solid #10b981",
                },
              },
              error: {
                iconTheme: {
                  primary: "#f87171",
                  secondary: "#0f172a",
                },
                style: {
                  background: "#0f172a",
                  borderLeft: "3px solid #f87171",
                },
              },
              loading: {
                iconTheme: {
                  primary: "#0d9488",
                  secondary: "#0f172a",
                },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
