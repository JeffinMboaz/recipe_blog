
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { checkSession, universalLogin } from "../services/userServices.js";

function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await universalLogin(formData);

      const { role } = res.data;

      const session = await checkSession();

      if (session.data?.isLoggedIn) {
        setAuth({
          isLoggedIn: true,
          role: session.data.role,
          user: session.data.user,
        });

        localStorage.setItem(
          "authData",
          JSON.stringify({
            isLoggedIn: true,
            role: session.data.role,
            user: session.data.user,
          })
        );

        if (role === "admin") navigate("/admindashboard");
        else if (role === "user") navigate("/userdashboard");
      } else {
        setError("Login verification failed. Try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: `url("https://thumbs.dreamstime.com/b/spiced-tea-cups-tray-dark-background-recipe-398554679.jpg")`,
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 "></div>

      {/* Glass Effect Login Card */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md border border-white/30 
                      rounded-2xl shadow-2xl p-8 text-white">
        <h2 className="text-3xl font-bold text-center mb-6 drop-shadow-lg">
          Login
        </h2>

        {error && (
          <p className="text-red-400 text-center font-medium mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-white/90">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 
                         placeholder-white/70 text-white focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-white/90">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 
                         placeholder-white/70 text-white focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600/80 hover:bg-orange-700 text-white py-3 rounded-lg 
                       transition-all duration-200 shadow-lg hover:shadow-orange-500/50 disabled:bg-orange-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-white/90">
          Don’t have an account?{" "}
          <span
            className="text-orange-300 hover:text-orange-400 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
