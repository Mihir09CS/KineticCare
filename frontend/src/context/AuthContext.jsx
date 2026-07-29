import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user on app mount
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await authService.getMe();
      setUser(userData);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Listen to unauthorized interceptor event
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener("kinetic_unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("kinetic_unauthorized", handleUnauthorized);
    };
  }, [checkAuth]);

  const loginUser = async (credentials) => {
    const data = await authService.login(credentials);
    if (data?.accessToken) {
      localStorage.setItem("kinetic_access_token", data.accessToken);
    }
    if (data?.user) {
      setUser(data.user);
    } else {
      await checkAuth();
    }
    return data;
  };

  const loginWithGoogle = async (idToken) => {
    const data = await authService.googleLogin(idToken);
    if (data?.accessToken) {
      localStorage.setItem("kinetic_access_token", data.accessToken);
    }
    if (data?.user) {
      setUser(data.user);
    } else {
      await checkAuth();
    }
    return data;
  };

  const registerUser = async (userData) => {
    const data = await authService.register(userData);
    return data;
  };

  const logoutUser = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("kinetic_access_token");
      setUser(null);
    }
  };

  const updateUserProfile = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    login: loginUser,
    googleLogin: loginWithGoogle,
    register: registerUser,
    logout: logoutUser,
    updateUser: updateUserProfile,
    refreshUser: checkAuth,
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
