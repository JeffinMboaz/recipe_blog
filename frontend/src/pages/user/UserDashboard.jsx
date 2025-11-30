

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { BsStars } from "react-icons/bs";
import { FaRegGrinStars, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdStar } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { getAllRecipes, getAllReviews, searchRecipe } from "../../services/userServices";

function UserDashboard() {
  const [recipes, setRecipes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = auth?.user?._id;

  const [favorites, setFavorites] = useState(() => {
    if (!userId) return [];
    const saved = localStorage.getItem(`favoriteRecipes_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (userId) {
      const saved = localStorage.getItem(`favoriteRecipes_${userId}`);
      setFavorites(saved ? JSON.parse(saved) : []);
    }
  }, [userId]);

  // ✅ Fetch all recipes
const fetchRecipes = async (query = "") => {
  try {
    setLoading(true);

    const res = query
      ? await searchRecipe(query)
      : await getAllRecipes();

    const data = res.data.recipes || res.data;
    setRecipes(data);
    setNoResults(data.length === 0);
    setIsSearchMode(!!query);
    setSearchTerm("");
  } catch (err) {
    console.error("FETCH RECIPES ERROR:", err);
  } finally {
    setLoading(false);
  }
};


  // ✅ On load or URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || params.get("category") || params.get("tags");
    fetchRecipes(query || "");
  }, [location.search]);

  // ✅ Fetch reviews (only once)
  useEffect(() => {
   
      getAllReviews().then((res) => setReviews(res.data))
      .catch(console.error);
  }, []);

  // ❤️ Toggle favorite
  const handleToggleFavorite = (recipeId) => {
    setFavorites((prev) => {
      const updated = prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId];
      if (userId)
        localStorage.setItem(`favoriteRecipes_${userId}`, JSON.stringify(updated));
      return updated;
    });
  };

  // 🔍 Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`?search=${searchTerm}`);
  };

  // ✨ Variants
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const formattedName =
    auth?.user?.name
      ? auth.user.name.charAt(0).toUpperCase() + auth.user.name.slice(1)
      : "";

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* 🔥 Hero Banner */}
      <div
        className="w-full h-60 md:h-72 bg-cover bg-center  shadow relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl font-lora text-white drop-shadow-lg tracking-tight"
          >
            Create. Cook. Inspire
          </motion.h1>

          <motion.h1
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-bold text-yellow-400 mt-2"
          >
            tells a story <BsStars className="inline-block text-yellow-300 mt-1" />
          </motion.h1>

          {auth?.isLoggedIn && formattedName && (
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="mt-6"
            >
              <p className="text-lg md:text-2xl text-gray-100 font-medium">
                Welcome back,
              </p>
              <span className="flex items-center justify-center gap-2 text-3xl md:text-4xl text-amber-400 font-semibold mt-1">
                {formattedName}
                <FaRegGrinStars className="inline-block text-yellow-400 mt-1" />
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* 📚 Search + Recipes */}
      <div className="px-5 md:px-10 py-8">
        {/* 🔍 Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mb-6 flex justify-center items-center gap-3 flex-wrap"
        >
          <input
            type="text"
            placeholder="Search recipes by name, description, or tags..."
            className="w-full sm:w-2/3 lg:w-1/2 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-400 outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition"
          >
            <IoSearchOutline size={22} />
          </button>
        </form>

        <h2 className="text-2xl font-bold mb-4">
          {isSearchMode ? "Search Results" : "All Recipes"}
        </h2>

        {/* 🌀 Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : noResults ? (
          // 🚫 No Results
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076509.png"
              alt="No Results"
              className="w-32 mb-4 opacity-80"
            />
            <p className="text-gray-500 text-lg">No recipes found. Try another search!</p>
          </div>
        ) : (
          // 🍳 Recipes Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {recipes.map((recipe) => {
              const isFavorite = favorites.includes(recipe._id);
              return (
                <motion.div
                  key={recipe._id}
                  className="relative bg-white  shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 cursor-pointer flex flex-col"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* ❤️ Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(recipe._id);
                    }}
                    className="absolute top-3 right-3 z-10 text-2xl transition-transform hover:scale-110"
                  >
                    {isFavorite ? (
                      <FaHeart className="text-red-500 drop-shadow-md" />
                    ) : (
                      <FaRegHeart className="text-gray-400 hover:text-red-400" />
                    )}
                  </button>

                  {/* 📸 Image */}
                  <div
                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                    className="relative w-full aspect-[4/3] overflow-hidden"
                  >
                    <motion.img
                      src={recipe.image?.[0] || "/placeholder.jpg"}
                      alt={recipe.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* 📝 Info */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <h3
                      onClick={() => navigate(`/recipe/${recipe._id}`)}
                      className="text-lg font-semibold mb-1 line-clamp-1 hover:text-orange-500 transition"
                    >
                      {recipe.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-2">
                      <button
                        onClick={() => navigate(`?category=${recipe.category}`)}
                        className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full hover:bg-orange-200 transition"
                      >
                        {recipe.category}
                      </button>

                      {recipe.tags?.map((tag, idx) => (
                        <button
                          key={idx}
                          onClick={() => navigate(`?tags=${tag}`)}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 transition"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ⭐ Reviews Section (only if not searching) */}
        {!isSearchMode && !loading && !noResults && (
          <>
            <h2 className="text-2xl font-bold mt-10 mb-4">Recent Reviews</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((review) => {
                const reviewer = review.user || {};
                const username = reviewer.name
                  ? reviewer.name.charAt(0).toUpperCase() + reviewer.name.slice(1)
                  : "Anonymous";
                const userImage = reviewer.profilePicture || "/default-avatar.png";

                return (
                  <motion.div
                    key={review._id}
                    className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.04 }}
                  >
                    <h2 className="font-semibold mb-1">{review.recipe.title}</h2>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
                        <img
                          src={userImage}
                          alt={username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(5)].map((_, index) => (
                          <MdStar
                            key={index}
                            className={`text-xl ${
                              index < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="italic text-gray-700 text-sm leading-relaxed">
                      “{review.review}”
                    </p>
                    <p className="mt-3 text-sm text-gray-600 font-medium italic text-right">
                      — {username}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
