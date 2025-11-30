

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  admAllRecipe,
  admUpdateRecipe
} from "../../services/adminServices";

export default function UpdateRecipe() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    preparationTime: "",
    cookTime: "",
    difficulty: "",
    category: "",
    ingredients: [""],
    tags: [""],
    steps: [{ stepNumber: 1, instruction: "" }],
    images: [],
    video: null,
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Load all recipes on mount
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const res = await admAllRecipe();
        setRecipes(res.data || []);
      } catch (err) {
        console.error("Error fetching admin recipes:", err);
      }
    };
    loadRecipes();
  }, []);

  // ✅ Load selected recipe data
  useEffect(() => {
    if (!selectedRecipe) return;

    const loadRecipeDetails = async () => {
      try {
        const res = await admAllRecipe();
        const data = res.data;
        const recipe = data.find((r) => r._id === selectedRecipe);
        if (recipe) {
          setFormData({
            title: recipe.title || "",
            description: recipe.description || "",
            preparationTime: recipe.preparationTime || "",
            cookTime: recipe.cookTime || "",
            difficulty: recipe.difficulty || "",
            category: recipe.category || "",
            ingredients: recipe.ingredients || [""],
            tags: recipe.tags || [""],
            steps: recipe.steps || [{ stepNumber: 1, instruction: "" }],
            images: recipe.image || [],
            video: recipe.video || null,
          });
        }
      } catch (err) {
        console.error("Error loading recipe details:", err);
      }
    };
    loadRecipeDetails();
  }, [selectedRecipe]);

  // ✅ Handle field changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleArrayChange = (index, field, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayField = (field) =>
    setFormData({ ...formData, [field]: [...formData[field], ""] });

  const handleStepChange = (index, field, value) => {
    const updated = [...formData.steps];
    updated[index][field] = value;
    setFormData({ ...formData, steps: updated });
  };

  const addStep = () =>
    setFormData({
      ...formData,
      steps: [
        ...formData.steps,
        { stepNumber: formData.steps.length + 1, instruction: "" },
      ],
    });

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const form = new FormData();
      const fields = [
        "title",
        "description",
        "preparationTime",
        "cookTime",
        "difficulty",
        "category",
      ];

      fields.forEach((key) => form.append(key, formData[key]));
      formData.ingredients.forEach((val) => form.append("ingredients", val));
      formData.tags.forEach((val) => form.append("tags", val));
      formData.steps.forEach((step, i) => {
        form.append(`steps[${i}][stepNumber]`, step.stepNumber);
        form.append(`steps[${i}][instruction]`, step.instruction);
      });

      if (formData.newImages)
        for (const img of formData.newImages) form.append("images", img);
      if (formData.newVideo)
        form.append("video", formData.newVideo);

      await admUpdateRecipe(selectedRecipe, form);
      setMessage("✅ Recipe updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("❌ Error updating recipe: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-gray-50 via-white to-orange-50 p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-3xl p-8 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          🔧 Update Recipe
        </h2>

        {/* Select Recipe */}
        <label>Select Recipe</label>
        <select
          value={selectedRecipe}
          onChange={(e) => setSelectedRecipe(e.target.value)}
          className="w-full p-3 border rounded-lg mb-6"
        >
          <option value="">-- Choose --</option>
          {recipes.map((r) => (
            <option key={r._id} value={r._id}>
              {r.title}
            </option>
          ))}
        </select>

        {/* Update Form */}
        {selectedRecipe && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            {/* Description */}
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border rounded-lg"
            ></textarea>

            {/* Preparation & Cook Time */}
            <label>Preparation Time</label>
            <input
              type="text"
              name="preparationTime"
              value={formData.preparationTime}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <label>Cook Time</label>
            <input
              type="text"
              name="cookTime"
              value={formData.cookTime}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            {/* Difficulty */}
            <label>Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Category */}
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            {/* Ingredients */}
            <label>Ingredients</label>
            {formData.ingredients.map((ing, i) => (
              <input
                key={i}
                value={ing}
                onChange={(e) =>
                  handleArrayChange(i, "ingredients", e.target.value)
                }
                className="w-full p-3 mb-2 border rounded-lg"
              />
            ))}
            <button
              type="button"
              onClick={() => addArrayField("ingredients")}
              className="text-orange-600 hover:underline"
            >
              + Add Ingredient
            </button>

            {/* Tags */}
            <div>
              <label>Tags</label>
              {formData.tags.map((tag, i) => (
                <input
                  key={i}
                  value={tag}
                  onChange={(e) =>
                    handleArrayChange(i, "tags", e.target.value)
                  }
                  className="w-full p-3 mb-2 border rounded-lg"
                />
              ))}
              <button
                type="button"
                onClick={() => addArrayField("tags")}
                className="text-orange-600 hover:underline"
              >
                + Add Tag
              </button>
            </div>

            {/* Steps */}
            <label>Steps</label>
            {formData.steps.map((s, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="number"
                  value={s.stepNumber}
                  onChange={(e) =>
                    handleStepChange(i, "stepNumber", e.target.value)
                  }
                  className="w-24 p-2 border rounded-lg"
                />
                <input
                  type="text"
                  value={s.instruction}
                  onChange={(e) =>
                    handleStepChange(i, "instruction", e.target.value)
                  }
                  className="flex-1 p-2 border rounded-lg"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="text-orange-600 hover:underline"
            >
              + Add Step
            </button>

            {/* Images */}
            <div>
              <label>Images</label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setFormData({ ...formData, newImages: files });
                  setPreviewImages(files.map((f) => URL.createObjectURL(f)));
                }}
              />
              {previewImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {previewImages.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-24 h-24 object-cover border rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Video */}
            <label>Video</label>
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData({ ...formData, newVideo: file });
                setPreviewVideo(URL.createObjectURL(file));
              }}
            />
            {previewVideo && (
              <video
                controls
                src={previewVideo}
                className="w-full mt-3 rounded-lg border"
              ></video>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 py-3 rounded-lg"
              >
                Back
              </button>
            </div>
          </form>
        )}

        {/* Message */}
        {message && (
          <p className="mt-6 text-center font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
