import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const { axios, setShowLogin, applyAuth } = useAppContext();

  const [mode, setMode] = useState("login"); // "login" or "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (mode === "register" && (!name || !email || !password)) {
      toast.error("Please fill all fields");
      return;
    }

    if (mode === "login" && (!email || !password)) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const endpoint = mode === "login" ? "login" : "register";
      const payload =
        mode === "register" ? { name, email, password } : { email, password };

      const { data } = await axios.post(`/api/user/${endpoint}`, payload);

      if (data.success && data.token) {
        applyAuth(data.token, data.user);
        setShowLogin(false);
        toast.success(
          data.message || (mode === "login" ? "Login successful" : "Registration successful")
        );
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Login/Register error:", err);
      toast.error(err.response?.data?.message || "Request failed. Please try again.");
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/50"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-white w-80 p-6 rounded-md space-y-4 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-center">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        {mode === "register" && (
          <input
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {mode === "login" ? "Login" : "Register"}
        </button>

        <p className="text-sm text-center">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-blue-600 cursor-pointer"
          >
            Click here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
