import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_HOST}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMessage(data.message);
    setLoading(false);

    if (data.success) {
      localStorage.setItem("token", JSON.stringify(data.token));
      setTimeout(() => navigate("/contacts"), 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Welcome Back 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Login to access your contacts
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value.trim() })
              }
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your email..."
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your password..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold 
            transition-all duration-200 shadow-md
            ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p>
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>
          <p>
            Forgot Password?{" "}
            <span
              className="text-red-500 dark:text-red-400 font-semibold hover:underline cursor-pointer"
              onClick={() => navigate("/reset")}
            >
              Reset
            </span>
          </p>
        </div>

        {/* Message Toast */}
        {message && (
          <div
            className={`text-center p-3 rounded-lg text-sm font-medium mt-2 transition 
            ${
              message.toLowerCase().includes("success")
                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
