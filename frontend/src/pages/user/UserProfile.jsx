

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaHeart, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import RecipeModal from "../../components/recipe/RecipeModal";
import {
  deleteMyRecipe,
  deleteReview,
  deleteUser,
  editReview,
  getAllRecipes,
  myProfile,
  myRecipe,
  myReview,
  updateMyProfile,
} from "../../services/userServices";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserProfile() {
  const { auth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [myRecipes, setMyRecipes] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editRecipe, setEditRecipe] = useState(null);

  // 👤 Edit Profile Modal
  const [editingUser, setEditingUser] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    phone: "",
    bio: "",
    title: "",
  });
  const [profileFile, setProfileFile] = useState(null);

  // 🔹 Review editing state
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editRating, setEditRating] = useState(0);

  // 🔔 Custom confirmation toast
  const confirmAction = (message, onConfirm) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p>{message}</p>
          <div className="flex gap-2 mt-3">
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => {
                onConfirm();
                closeToast();
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-400 text-white px-2 py-1 rounded"
              onClick={closeToast}
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  // ✅ Fetch my recipes
  const fetchMyRecipes = () => {
    myRecipe()
      .then((res) => setMyRecipes(res.data.recipes || []))
      .catch((err) => console.log("MY RECIPES ERROR:", err));
  };

  // ✅ Delete recipe
  const handleDeleteRecipe = async (id) => {
    confirmAction("Are you sure you want to delete this recipe?", async () => {
      try {
        await deleteMyRecipe(id);
        fetchMyRecipes();
        toast.success("Recipe deleted successfully!");
      } catch (err) {
        console.error("DELETE RECIPE ERROR:", err);
        toast.error("Failed to delete recipe!");
      }
    });
  };

  // ✅ Load user profile
  useEffect(() => {
    myProfile()
      .then((res) => {
        const u = res.data.user;
        setUser(u);
        setPreviewImage(u.profilePicture);
        setUpdatedData({
          name: u.name || "",
          phone: u.phone || "",
          bio: u.bio || "",
          title: u.title || "",
        });
      })
      .catch((err) => console.log("PROFILE ERROR:", err));
  }, []);

  // ✅ Load all recipes (for favorites)
  useEffect(() => {
    getAllRecipes()
      .then((res) => setAllRecipes(res.data || []))
      .catch((err) => console.log("ALL RECIPES ERROR:", err));
  }, []);

  // ✅ Load my reviews
  const fetchMyReviews = () => {
    myReview()
      .then((res) => {
        const reviews = Array.isArray(res.data)
          ? res.data
          : res.data.reviews || [];
        setMyReviews(reviews);
      })
      .catch((err) => console.log("MY REVIEWS ERROR:", err));
  };

  // ✅ Update Review
  const handleUpdateReview = async () => {
    if (!editingReview) return;
    try {
      await editReview(editingReview._id, {
        rating: editRating,
        review: editReviewText,
      });
      setEditingReview(null);
      fetchMyReviews();
      toast.success("Review updated successfully!");
    } catch (err) {
      console.error("UPDATE REVIEW ERROR:", err);
      toast.error("Failed to update review!");
    }
  };

  // ✅ Delete Review
  const handleDeleteReview = async (id) => {
    confirmAction("Delete this review?", async () => {
      try {
        await deleteReview(id);
        fetchMyReviews();
        toast.success("Review deleted!");
      } catch (err) {
        console.error("DELETE REVIEW ERROR:", err);
        toast.error("Failed to delete review!");
      }
    });
  };

  // ✅ Sync favorites (per user)
  useEffect(() => {
    if (auth?.user?._id) {
      const saved = localStorage.getItem(`favoriteRecipes_${auth.user._id}`);
      setFavorites(saved ? JSON.parse(saved) : []);
    }
  }, [auth?.user?._id]);

  // ✅ Sync favorites across browser tabs
  useEffect(() => {
    const handleStorageChange = () => {
      if (auth?.user?._id) {
        const saved = localStorage.getItem(`favoriteRecipes_${auth.user._id}`);
        setFavorites(saved ? JSON.parse(saved) : []);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [auth?.user?._id]);

  // ✅ Sync active tab
  useEffect(() => {
    if (location.state?.tab) setActiveTab(location.state.tab);
  }, [location.state]);

  // ✅ Fetch data based on tab
  useEffect(() => {
    if (activeTab === "recipes") fetchMyRecipes();
    if (activeTab === "reviews") fetchMyReviews();
  }, [activeTab]);

  if (!user)
    return <div className="p-10 text-center text-lg">Loading Profile...</div>;

  const favoriteRecipes = allRecipes.filter((r) => favorites.includes(r._id));

  // ✅ Update User Profile Function
  const handleUpdateUserProfile = async () => {
    try {
      const formData = new FormData();
      Object.entries(updatedData).forEach(([key, val]) => {
        if (val && val !== user[key]) formData.append(key, val);
      });
      if (profileFile) formData.append("profilePicture", profileFile);

      const res = await updateMyProfile(user._id, formData);

      setUser(res.data.user);
      setPreviewImage(res.data.user.profilePicture);
      setEditingUser(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("UPDATE PROFILE ERROR:", err);
      toast.error("Failed to update profile!");
    }
  };

  // ✅ Delete User
  const handleDeleteUser = async () => {
    confirmAction("Are you sure you want to delete your account?", async () => {
      try {
        await deleteUser(user._id);
        toast.success("Your account has been deleted.");
        navigate("/login");
      } catch (err) {
        console.error("DELETE USER ERROR:", err);
        toast.error("Failed to delete account!");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex flex-1 w-full">
        {/* Sidebar */}
        <aside className="hidden md:block bg-gray-900 text-white w-64 p-5 overflow-y-auto">
          <h2 className="text-xl font-bold mb-6">User Panel</h2>
          <ul className="space-y-3">
            {["profile", "recipes", "reviews", "favorites"].map((tab) => (
              <li
                key={tab}
                className={`cursor-pointer ${
                  activeTab === tab ? "text-yellow-400 font-semibold" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "profile"
                  ? "My Profile"
                  : tab === "recipes"
                  ? "My Recipes"
                  : tab === "reviews"
                  ? "My Reviews"
                  : "Favorites"}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* 👤 Profile Tab */}
          {activeTab === "profile" && (
            <div>
              <h1 className="text-3xl font-bold mb-4">My Profile</h1>
              <div className="bg-white p-6 rounded shadow-md text-center relative">
                <div className="absolute top-4 right-4 flex gap-3">
                  <button
                    onClick={() => setEditingUser(true)}
                    className="bg-blue-500 text-white p-2 rounded-full"
                    title="Edit Profile"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="bg-red-500 text-white p-2 rounded-full"
                    title="Delete Account"
                  >
                    <FaTrash />
                  </button>
                </div>

                <img
                  src={previewImage || "/default-avatar.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mb-4 object-cover mx-auto"
                />
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone}
                </p>
                <p>
                  <strong>Bio:</strong> {user.bio}
                </p>
                <p>
                  <strong>Title:</strong> {user.title}
                </p>
              </div>
            </div>
          )}

          {/* 🍳 My Recipes */}
          {activeTab === "recipes" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">My Recipes</h1>
                <button
                  onClick={() => {
                    setEditRecipe(null);
                    setShowModal(true);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2"
                >
                  <FaPlus /> Add Recipe
                </button>
              </div>

              {!myRecipes || myRecipes.length === 0 ? (
                <p>No recipes created yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {myRecipes.map((r) => (
                    <div key={r._id} className="bg-white shadow rounded p-4 relative">
                      <img
                        src={r.image?.[0]}
                        alt={r.title}
                        className="w-full h-40 object-cover rounded"
                      />
                      <h3 className="text-lg font-semibold mt-2">{r.title}</h3>

                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => {
                            setEditRecipe(r);
                            setShowModal(true);
                          }}
                          className="bg-blue-500 text-white p-2 rounded-full"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteRecipe(r._id)}
                          className="bg-red-500 text-white p-2 rounded-full"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <RecipeModal
                show={showModal}
                onClose={() => setShowModal(false)}
                editRecipe={editRecipe}
                refreshRecipes={fetchMyRecipes}
              />
            </div>
          )}

          {/* ⭐ My Reviews */}
          {activeTab === "reviews" && (
            <div>
              <h1 className="text-3xl font-bold mb-4">My Reviews</h1>
              {!myReviews || myReviews.length === 0 ? (
                <p>No reviews yet.</p>
              ) : (
                myReviews.map((r) => (
                  <div key={r._id} className="bg-white p-4 shadow rounded mb-3">
                    <p>
                      <strong>Recipe:</strong> {r.recipe?.title}
                    </p>
                    <p>
                      <strong>Rating:</strong> ⭐ {r.rating}
                    </p>
                    <p className="mb-3">{r.review}</p>

                    <div className="flex gap-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1"
                        onClick={() => {
                          setEditingReview(r);
                          setEditReviewText(r.review);
                          setEditRating(r.rating);
                        }}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1"
                        onClick={() => handleDeleteReview(r._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}

              {editingReview && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                    <h2 className="text-xl font-bold mb-3">Edit Review</h2>
                    <label className="block mb-2 text-sm font-semibold">
                      Rating:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editRating}
                      onChange={(e) =>
                        setEditRating(Number(e.target.value))
                      }
                      className="border p-2 w-full mb-3 rounded"
                    />
                    <label className="block mb-2 text-sm font-semibold">
                      Review:
                    </label>
                    <textarea
                      value={editReviewText}
                      onChange={(e) => setEditReviewText(e.target.value)}
                      rows="4"
                      className="border p-2 w-full rounded mb-4"
                    ></textarea>

                    <div className="flex justify-end gap-2">
                      <button
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                        onClick={() => setEditingReview(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={handleUpdateReview}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ❤️ Favorites */}
          {activeTab === "favorites" && (
            <div>
              <h1 className="text-3xl font-bold mb-4">
                My Favorite Recipes
              </h1>
              {!favoriteRecipes || favoriteRecipes.length === 0 ? (
                <p>No favorite recipes yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteRecipes.map((r) => (
                    <div
                      key={r._id}
                      className="bg-white rounded-xl shadow hover:shadow-lg transition relative group cursor-pointer"
                    >
                      <div
                        className="relative"
                        onClick={() => navigate(`/recipe/${r._id}`)}
                      >
                        <img
                          src={r.image?.[0]}
                          alt={r.title}
                          className="rounded-t-lg h-48 w-full object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = favorites.filter(
                              (id) => id !== r._id
                            );
                            setFavorites(updated);
                            localStorage.setItem(
                              `favoriteRecipes_${auth.user._id}`,
                              JSON.stringify(updated)
                            );
                          }}
                          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-red-500 p-2 rounded-full transition"
                        >
                          <FaHeart className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{r.title}</h3>
                        <p className="text-sm text-gray-500">
                          {r.category} • {r.difficulty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* 🧩 Edit Profile Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <input
              type="text"
              placeholder="Name"
              value={updatedData.name}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, name: e.target.value })
              }
              className="border p-2 w-full mb-3 rounded"
            />
            <input
              type="text"
              placeholder="Phone"
              value={updatedData.phone}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, phone: e.target.value })
              }
              className="border p-2 w-full mb-3 rounded"
            />
            <input
              type="text"
              placeholder="Title"
              value={updatedData.title}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, title: e.target.value })
              }
              className="border p-2 w-full mb-3 rounded"
            />
            <textarea
              placeholder="Bio"
              rows="3"
              value={updatedData.bio}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, bio: e.target.value })
              }
              className="border p-2 w-full mb-3 rounded"
            ></textarea>

            <label className="block mb-2 font-semibold">
              Profile Picture:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileFile(e.target.files[0])}
              className="mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setEditingUser(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={handleUpdateUserProfile}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} pauseOnHover />
    </div>
  );
}

export default UserProfile;
