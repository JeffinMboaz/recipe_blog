
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { admAllRecipe, admDeleteRecipe } from "../../services/adminServices";

export default function DeleteRecipe() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch all recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await admAllRecipe();
        // Axios stores response data under `res.data`
        setRecipes(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch recipes:", err);
        setMessage("❌ Failed to load recipes.");
      }
    };
    fetchRecipes();
  }, []);

  // ✅ Handle recipe delete
  const handleDelete = async () => {
    if (!selectedRecipe) return;
    setMessage("");

    try {
      await admDeleteRecipe(selectedRecipe._id);
      setMessage("✅ Recipe deleted successfully!");
      setRecipes((prev) => prev.filter((r) => r._id !== selectedRecipe._id));
      setSelectedRecipe(null);
      setConfirmDelete(false);
    } catch (err) {
      console.error("❌ Delete recipe error:", err);
      const errorMsg = err.response?.data?.error || err.message;
      setMessage(`❌ ${errorMsg}`);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-50 via-white to-orange-50 py-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          🍳 Delete Recipe
        </h2>

        {/* Dropdown */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Select a Recipe
          </label>
          <select
            className="w-full border rounded-lg p-3 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
            value={selectedRecipe?._id || ""}
            onChange={(e) => {
              const recipe = recipes.find((r) => r._id === e.target.value);
              setSelectedRecipe(recipe || null);
              setMessage("");
            }}
          >
            <option value="">-- Choose Recipe --</option>
            {recipes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.title} ({r.category})
              </option>
            ))}
          </select>
        </div>

        {/* Recipe Details */}
        {selectedRecipe && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Recipe Details
            </h3>
            <div className="space-y-2 text-gray-700 text-sm sm:text-base">
              <p>
                <strong>Title:</strong> {selectedRecipe.title}
              </p>
              <p>
                <strong>Category:</strong> {selectedRecipe.category || "N/A"}
              </p>
              <p>
                <strong>Difficulty:</strong> {selectedRecipe.difficulty || "N/A"}
              </p>
              <p>
                <strong>Preparation Time:</strong>{" "}
                {selectedRecipe.preparationTime || "N/A"}
              </p>
              <p>
                <strong>Cook Time:</strong> {selectedRecipe.cookTime || "N/A"}
              </p>
              <p>
                <strong>Created By:</strong>{" "}
                {selectedRecipe.createdBy?.name || "Unknown"}
              </p>

              {selectedRecipe.image && selectedRecipe.image.length > 0 && (
                <img
                  src={selectedRecipe.image[0]}
                  alt={selectedRecipe.title}
                  className="mt-3 w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        {selectedRecipe && (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
            >
              🗑️ Delete Recipe
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
      {confirmDelete && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 sm:w-96 text-center animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium text-red-600">
                {selectedRecipe.title}
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
