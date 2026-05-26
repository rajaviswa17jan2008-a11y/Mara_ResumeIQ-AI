import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import {
  userAPI,
  authAPI
} from "../services/api";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {

  const savedUser =
    localStorage.getItem("user");

  return savedUser
    ? JSON.parse(savedUser)
    : null;

});
    useEffect(() => {

  const loadUser =
    async () => {
      try {
const token =
  localStorage.getItem(
    "resumeiq_token"
  );

if (!token) return;
      

        const savedUser =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

       if (!savedUser?.email) {

  setUser(null);

  return;

}
        setUser(savedUser);

        const res =
          await userAPI
          .getProfile()

        if (res.data.user) {

  const mergedUser = {
    ...savedUser,
    ...res.data.user,
  };

  setUser(mergedUser);

  localStorage.setItem(
    "user",
    JSON.stringify(mergedUser)
  );

}

      } catch (err) {

        console.log(err);

      }

    };

  loadUser();

}, []);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = useCallback(
  async (email, password) => {

    try {

      const { data } =
        await authAPI.login({
          email,
          password,
        });

      localStorage.setItem(
        "resumeiq_token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      toast.success(
        `Welcome back, ${data.user.name}! 👋`
      );

      navigate(
        data.user.role === "admin"
          ? "/admin"
          : "/dashboard"
      );

      return true;

    } catch (err) {

      const msg =
        err.response?.data?.message ||
        "Login failed";

      toast.error(msg);

      return false;

    }

  },
  [navigate]
);

  const signup = useCallback(async (userData) => {
    try {
      const { data } = await authAPI.register(userData);

      localStorage.setItem(
        "resumeiq_token",
        data.token
      );

      setUser(data.user);
      console.log(
  "LOGIN USER:",
  data.user
);
      localStorage.setItem(
  "user",
  JSON.stringify(data.user)
);

      toast.success(
        "Account created successfully 🚀"
      );

      navigate("/dashboard");

      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Registration failed";

      toast.error(msg);

      return {
        success: false,
        error: msg,
      };
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem("resumeiq_token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");

    toast.success("Logged out successfully");
  }, [navigate]);

  const value = {
    user,
    loading,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};