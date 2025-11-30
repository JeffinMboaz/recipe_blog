

import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import {
  admAllRecipe,
  admAllReview,
  admAllStats,
  admAllUsers,
  admDeleteUser,
} from "../../services/adminServices";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmUser, setConfirmUser] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await admAllStats();
        setStats(res.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await admAllUsers();
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    setMessage("");
    try {
      await admDeleteUser(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      setMessage("✅ User deleted successfully!");
      setConfirmUser(null);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const res = await admAllRecipe();
        setAllRecipes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllRecipes();
  }, []);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await admAllReview();
        setAllReviews(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllReviews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-100 p-6 sm:p-8">
      <h2 className="flex items-center justify-center gap-2 text-4xl font-extrabold text-gray-800 mb-10 tracking-tight">
        <RiAdminFill className="text-black text-5xl" />
        <span>Admin Dashboard</span>
      </h2>

      {/* Navigation */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {[{ label: "Overview", to: "/admindashboard" }].map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
              location.pathname === tab.to
                ? "bg-orange-600 text-white shadow-md scale-105"
                : "bg-white text-gray-800 border hover:bg-orange-100"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Main Dashboard */}
      {location.pathname === "/admindashboard" ? (
        <div>
          {error && (
            <p className="text-red-500 text-center font-semibold mb-6">
              ⚠️ {error}
            </p>
          )}

          {stats ? (
            <div className="flex flex-col items-center space-y-12">
              {/* ✅ Dashboard Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <DashboardCard
                  title="Total Users"
                  value={stats.totalUsers}
                  emoji="👥"
                  gradient="from-blue-500 to-indigo-500"
                />
                <DashboardCard
                  title="Total Recipes"
                  value={stats.totalRecipes}
                  emoji="🍳"
                  gradient="from-green-400 to-emerald-500"
                />
                <DashboardCard
                  title="Total Reviews"
                  value={stats.totalReviews}
                  emoji="⭐"
                  gradient="from-yellow-400 to-orange-500"
                />
              </div>

              {/* Users Section */}
              <SectionCard title="👥 All Users" message={message}>
                {users.length > 0 ? (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className="flex justify-between items-center bg-gray-50 hover:bg-orange-50 p-3 rounded-lg transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.profilePicture ||
                            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                          }
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-300"
                        />
                        <div>
                          <p className="font-semibold text-gray-700">
                            {user.name}
                          </p>
                          <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setConfirmUser(user)}
                        className="text-red-600 hover:text-red-700 font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center italic">
                    No users found.
                  </p>
                )}
              </SectionCard>

              {/* Recipes Section */}
              <SectionCard title="🍳 All Recipes">
                {allRecipes.length > 0 ? (
                  allRecipes.map((recipe) => (
                    <div
                      key={recipe._id}
                      className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 hover:bg-orange-50 p-4 rounded-lg transition-all gap-4"
                    >
                      <img
                        src={
                          recipe.image?.[0] ||
                          "https://via.placeholder.com/120x120?text=No+Image"
                        }
                        alt={recipe.title}
                        className="w-28 h-28 rounded-lg object-cover border border-gray-200"
                      />
                      <div className="flex-1 text-center sm:text-left">
                        <p className="font-semibold text-lg text-gray-800">
                          {recipe.title}
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                          <img
                            src={
                              recipe.createdBy?.profilePicture ||
                              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                            }
                            alt={recipe.createdBy?.name || "User"}
                            className="w-8 h-8 rounded-full border"
                          />
                          <span className="text-gray-600 text-sm">
                            {recipe.createdBy?.name || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center italic">
                    No recipes found.
                  </p>
                )}
              </SectionCard>

              {/* Reviews Section */}
              <SectionCard title="⭐ All Reviews">
                {allReviews.length > 0 ? (
                  allReviews.map((review) => (
                    <div
                      key={review._id}
                      className="flex items-center gap-3 bg-gray-50 hover:bg-orange-50 p-3 rounded-lg transition-all"
                    >
                      <img
                        src={
                          review.user.profilePicture ||
                          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                        }
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full border object-cover"
                      />
                      <div>
                        <p className="text-gray-700 font-medium">
                          {review.review}
                        </p>
                        <p className="text-gray-500 text-sm">
                          — {review.user.name}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center italic">
                    No reviews found.
                  </p>
                )}
              </SectionCard>
            </div>
          ) : (
            <div className="flex justify-center items-center mt-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
              <p className="ml-3 text-gray-700 font-medium">
                Loading stats...
              </p>
            </div>
          )}
        </div>
      ) : (
        <Outlet />
      )}

      {/* Confirmation Modal */}
      {confirmUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 sm:w-96 text-center animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium text-red-600">
                {confirmUser.name}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDelete(confirmUser._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmUser(null)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ✅ Add these components below */
function DashboardCard({ title, value, emoji, gradient }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 p-6 text-center border-t-4 border-orange-400">
      <div
        className={`bg-gradient-to-r ${gradient} w-14 h-14 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-md`}
      >
        {emoji}
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function SectionCard({ title, message, children }) {
  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4 border-b pb-2">
        {title}
      </h3>
      {message && (
        <p
          className={`text-center mb-4 font-medium ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default AdminDashboard;
