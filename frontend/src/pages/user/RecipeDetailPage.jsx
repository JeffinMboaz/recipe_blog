
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { addReview, getOneRecipe, getReview, upreview } from "../../services/userServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RecipeDetailPage() {
  const { id } = useParams();
  const { auth } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Recipe
  const fetchRecipe = async () => {
    try {
      const res = await getOneRecipe(id);
      setRecipe(res.data);
    } catch (err) {
      toast.error("Failed to fetch recipe details.");
      console.error("RECIPE FETCH ERROR:", err);
    }
  };

  // Fetch Reviews
  const fetchReviews = async () => {
    try {
      const res = await getReview(id);
      setReviews(res.data);
    } catch (err) {
      toast.error("Failed to load reviews.");
      console.error("REVIEW FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchRecipe();
    fetchReviews();
  }, [id]);

  // Submit or Update Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!auth) return toast.warning("Please log in to leave a review.");
    if (!rating) return toast.warning("Please select a rating before submitting.");

    setLoading(true);
    try {
      if (editingReviewId) {
        await upreview(editingReviewId, { rating, review: reviewText }, { withCredentials: true });
        toast.success("Review updated successfully!");
        setEditingReviewId(null);
      } else {
        await addReview(id, { rating, review: reviewText }, { withCredentials: true });
        toast.success("Review added successfully!");
      }

      // Reset fields and refresh
      setReviewText("");
      setRating(0);
      await Promise.all([fetchReviews(), fetchRecipe()]);
    } catch (err) {
      const msg = err.response?.data?.message || "Error submitting review.";
      toast.error(msg);
      console.error("REVIEW SUBMIT ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!recipe) return <p className="p-10">Loading...</p>;

  const isYouTube = recipe.video?.includes("youtube.com") || recipe.video?.includes("youtu.be");

  return (
    <div className="p-5 md:p-10 max-w-6xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{recipe.title}</h1>

      {/* Main Image */}
      <img
        src={recipe.image?.[0]}
        alt={recipe.title}
        className="w-full max-h-96 object-cover shadow mb-6"
      />

      {/* Basic Info */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <p className="text-gray-700 text-lg">{recipe.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-600">
          <p><strong>Category:</strong> {recipe.category}</p>
          <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
          <p><strong>Preparation Time:</strong> {recipe.preparationTime}</p>
          <p><strong>Cook Time:</strong> {recipe.cookTime}</p>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {recipe.tags?.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-3">Ingredients</h2>
        <ul className="list-disc ml-5 text-gray-700">
          {recipe.ingredients?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-3">Steps</h2>
        <ol className="list-decimal ml-5 text-gray-700 space-y-2">
          {recipe.steps?.map((step, idx) => (
            <li key={idx}>{step.instruction}</li>
          ))}
        </ol>
      </div>

      {/* Video Section */}
      {recipe.video && (
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h2 className="text-2xl font-semibold mb-3">Recipe Video</h2>
          {isYouTube ? (
            <iframe
              width="100%"
              height="400"
              className="rounded-xl"
              src={recipe.video.replace("youtu.be/", "www.youtube.com/embed/")}
              allowFullScreen
            ></iframe>
          ) : (
            <video controls className="w-full rounded-xl shadow" src={recipe.video} />
          )}
        </div>
      )}

      {/* Review Form */}
      <div className="bg-white p-5 rounded-xl shadow mb-10">
        <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>

        {auth ? (
          <form onSubmit={handleSubmitReview}>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={25}
                  className={`cursor-pointer ${(hover || rating) >= star ? "text-yellow-400" : "text-gray-300"}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                />
              ))}
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review..."
              className="w-full border p-2 rounded mb-3"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Submitting..."
                : editingReviewId
                  ? "Update Review"
                  : "Submit Review"}
            </button>

            {editingReviewId && (
              <button
                type="button"
                onClick={() => {
                  setEditingReviewId(null);
                  setReviewText("");
                  setRating(0);
                  toast.info("Editing canceled");
                }}
                className="ml-3 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </form>
        ) : (
          <p className="text-gray-500">Please log in to write a review.</p>
        )}
      </div>

      {/* Reviews List */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6">Reviews & Ratings</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center mb-3">
                  <img
                    src={rev.user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                    alt={rev.user?.name || "User"}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <p className="font-semibold text-gray-800">{rev.user?.name || "User"}</p>
                </div>

                <div className="flex items-center text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={16}
                      className={i < rev.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-3">{rev.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeDetailPage;
