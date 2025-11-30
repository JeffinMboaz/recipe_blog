
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { admAllReview, admDeleteReview } from "../../services/adminServices";

export default function DeleteReview() {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  // Fetch all reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await admAllReview(); // axios call
        setReviews(res.data); // ✅ axios gives data in res.data
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to fetch reviews");
      }
    };
    fetchReviews();
  }, []);

  // Handle delete review
  const handleDelete = async () => {
    setMessage("");
    try {
      await admDeleteReview(selectedReview._id); // ✅ no need for res.json()
      setMessage("✅ Review deleted successfully!");
      setReviews((prev) => prev.filter((r) => r._id !== selectedReview._id));
      setSelectedReview(null);
      setConfirmDelete(false);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete review");
      setConfirmDelete(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-50 via-white to-orange-50 py-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          ⭐ Delete Review
        </h2>

        {/* Dropdown */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Select a Review
          </label>
          <select
            className="w-full border rounded-lg p-3 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
            value={selectedReview?._id || ""}
            onChange={(e) => {
              const review = reviews.find((r) => r._id === e.target.value);
              setSelectedReview(review || null);
              setMessage("");
            }}
          >
            <option value="">-- Choose Review --</option>
            {reviews.map((r) => (
              <option key={r._id} value={r._id}>
                {r.user?.name || "Unknown"} → {r.recipe?.title || "No Recipe"}
              </option>
            ))}
          </select>
        </div>

        {/* Review Details */}
        {selectedReview && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Review Details
            </h3>
            <div className="space-y-2 text-gray-700 text-sm sm:text-base">
              <p>
                <strong>User:</strong> {selectedReview.user?.name || "Unknown"}
              </p>
              <p>
                <strong>Recipe:</strong> {selectedReview.recipe?.title || "N/A"}
              </p>
              <p>
                <strong>Rating:</strong>{" "}
                <span className="text-yellow-500 font-bold">
                  {selectedReview.rating} ★
                </span>
              </p>
              <p>
                <strong>Review:</strong>{" "}
                <span className="italic">{selectedReview.review}</span>
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        {selectedReview && (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
            >
              🗑️ Delete Review
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg shadow-md transition-all"
            >
              ⬅️ Go Back
            </button>
          </div>
        )}

        {/* Feedback */}
        {message && (
          <p
            className={`mt-6 text-center font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 sm:w-96 text-center animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this review by{" "}
              <span className="font-medium text-red-600">
                {selectedReview.user?.name || "Unknown"}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
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
