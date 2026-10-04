import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Set default base URL from .env
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isOwner, setIsOwner] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser)?.role === "owner" : false;
    } catch {
      return false;
    }
  });
  const [showLogin, setShowLogin] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const currency = import.meta.env.VITE_CURRENCY || "$";

  // Set default authorization header immediately if token exists in localStorage
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Axios interceptor to ensure authorization header is always present
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const activeToken = token || localStorage.getItem("token");
      if (activeToken) {
        config.headers.Authorization = `Bearer ${activeToken}`;
      }
      return config;
    });

    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  // Sync token changes and fetch user profile
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Fetch all vehicles (public)
  useEffect(() => {
    fetchVehicles();
  }, []);

  const applyAuth = (newToken, newUser) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    }
    if (newUser) {
      setUser(newUser);
      setIsOwner(newUser.role === "owner");
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      }
    }
  };

  const fetchVehicles = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data.success) {
        setVehicles(data.cars);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to load vehicles.");
    }
  };

  const updateUserData = (newUserData) => {
    setUser(newUserData);
    setIsOwner(newUserData.role === "owner");
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsOwner(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully");
    navigate("/");
  };

  const value = {
    axios,
    token,
    setToken,
    user,
    setUser,
    isOwner,
    setIsOwner,
    showLogin,
    setShowLogin,
    applyAuth,
    fetchUser,
    updateUserData,
    logout,
    cars: vehicles,
    setCars: setVehicles,
    pickupLocation,
    setPickupLocation,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    currency,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
