import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ import toast
import { newUser } from "../services/userServices";

function SignUpPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
    bio: "",
    title: "",
    profilePicture: null,
  });

  const [previewImg, setPreviewImg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, profilePicture: file });
    setPreviewImg(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (form.password !== form.confirmpassword) {
      setErrorMsg("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));

      await newUser(formData);

      // ✅ Toast instead of alert
      toast.success(" Registration Successful!", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });

      // Redirect after a short delay (so user sees the toast)
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const errorText = err.response?.data?.error || "Registration failed.";
      setErrorMsg(errorText);

      toast.error(`❌ ${errorText}`, {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
    }

    setLoading(false);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: `url("https://t3.ftcdn.net/jpg/03/73/98/10/360_F_373981053_N6EoI6U0PhxZjvgDLuHgEevpjX74wvnA.jpg")`,
      }}
    >
      <div className="absolute inset-0 bg-black/40 "></div>

      <div className="relative w-full max-w-xl p-8 my-8 rounded-2xl shadow-2xl 
                      bg-white/10 backdrop-blur-md border border-white/30 text-white">
        <h2 className="text-3xl font-bold text-center mb-6 drop-shadow-lg">
          Create Account
        </h2>

        {errorMsg && <p className="text-red-400 text-center mb-4">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block font-medium text-white/90">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 
                         placeholder-white/70 text-white focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-white/90">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 
                           placeholder-white/70 text-white focus:ring-2 focus:ring-orange-400 outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block font-medium text-white/90">Phone</label>
              <input
                type="text"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 
                           placeholder-white/70 text-white focus:ring-2 focus:ring-orange-400 outline-none"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-medium text-white/90">Title (Optional)</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 
                         placeholder-white/70 text-white focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="Chef, Food Blogger, etc."
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block font-medium text-white/90">Bio (Optional)</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 
                         placeholder-white/70 text-white focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="Tell something about yourself..."
              rows="3"
            ></textarea>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-white/90">Password</label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 
                           placeholder-white/70 text-white focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-white/90">Confirm Password</label>
              <input
                type="password"
                name="confirmpassword"
                required
                value={form.confirmpassword}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 
                           placeholder-white/70 text-white focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block font-medium text-white/90">
              Profile Picture (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="text-white"
            />

            {previewImg && (
              <img
                src={previewImg}
                alt="Preview"
                className="w-24 h-24 mt-3 rounded-full object-cover border border-white/40"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600/80 hover:bg-orange-700 text-white py-3 rounded-lg 
                       transition-all duration-200 shadow-lg hover:shadow-orange-500/50 disabled:bg-orange-400"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-4 text-white/90">
          Already have an account?{" "}
          <span
            className="text-orange-400 hover:text-orange-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
