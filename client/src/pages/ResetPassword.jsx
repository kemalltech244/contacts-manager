import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    password2: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (form.password !== form.password2) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    const { password2, ...newForm } = form;
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_HOST}/api/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });

      const data = await res.json();
      setMessage(data.message);
      setLoading(false);

      if (data.success) {
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      console.error("Reset error:", err);
      setMessage("⚠️ Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Reset Password 🔒
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your details to reset your password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleReset} className="space-y-5">
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
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value.trim() })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your registered email..."
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value.trim() })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter new password..."
            />
          </div>

          <div>
            <label
              htmlFor="password2"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="password2"
              required
              value={form.password2}
              onChange={(e) =>
                setForm({ ...form, password2: e.target.value.trim() })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Confirm your new password..."
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div
            className={`text-center p-3 rounded-lg text-sm font-medium mt-3 transition 
            ${
              message.toLowerCase().includes("success")
                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Footer Link */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          <p>
            Remembered your password?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
