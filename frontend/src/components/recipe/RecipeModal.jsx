

import React, { useState, useEffect } from "react";
import { createRecipe, updateRecipe } from "../../services/userServices";

const RecipeModal = ({ show, onClose, editRecipe, refreshRecipes }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Easy",
    preparationTime: "",
    cookTime: "",
    video: "", // ✅ video link input
  });

  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([{ stepNumber: 1, instruction: "" }]);
  const [tags, setTags] = useState([""]);
  const [images, setImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null); // ✅ file upload state

  
useEffect(() => {
  if (editRecipe) {
    setForm({
      title: editRecipe.title || "",
      description: editRecipe.description || "",
      category: editRecipe.category || "",
      difficulty: editRecipe.difficulty || "Easy",
      preparationTime: editRecipe.preparationTime || "",
      cookTime: editRecipe.cookTime || "",
      video: editRecipe.video || "",
    });
    setIngredients(editRecipe.ingredients || [""]);
    setSteps(editRecipe.steps || [{ stepNumber: 1, instruction: "" }]);
    setTags(editRecipe.tags || [""]);
    setImages([]); // ✅ Reset file input
  }
}, [editRecipe]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleArrayChange = (setter, index, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleStepChange = (index, field, value) => {
    setSteps((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addField = (setter, defaultValue) =>
    setter((prev) => [...prev, defaultValue]);

  const removeField = (setter, index) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  const handleFileChange = (e) => setImages(e.target.files);
  const handleVideoFileChange = (e) => setVideoFile(e.target.files[0]); // ✅ single video file

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    ingredients.forEach((ing) => formData.append("ingredients[]", ing));
    steps.forEach((step, i) => {
      formData.append(`steps[${i}][stepNumber]`, step.stepNumber);
      formData.append(`steps[${i}][instruction]`, step.instruction);
    });
    tags.forEach((tag) => formData.append("tags[]", tag));
    Array.from(images).forEach((file) => formData.append("images", file));
    if (videoFile) formData.append("video", videoFile); // ✅ match backend


    try {
      if (editRecipe) {
        await updateRecipe(editRecipe._id, formData);
      } else {
        await createRecipe(formData);
      }
      refreshRecipes();
      onClose();
    } catch (err) {
      console.error("Recipe save error:", err);
    }

  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b rounded-t-xl z-10 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {editRecipe ? "Edit Recipe" : "Create Recipe"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="overflow-y-auto px-6 py-4 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                name="preparationTime"
                placeholder="Preparation Time (mins)"
                value={form.preparationTime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                name="cookTime"
                placeholder="Cook Time (mins)"
                value={form.cookTime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            {/* Ingredients */}
            <div>
              <h3 className="font-semibold">Ingredients</h3>
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 mt-2">
                  <input
                    value={ing}
                    onChange={(e) =>
                      handleArrayChange(setIngredients, i, e.target.value)
                    }
                    placeholder={`Ingredient ${i + 1}`}
                    className="flex-1 p-2 border rounded"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(setIngredients, i)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField(setIngredients, "")}
                className="text-blue-600 mt-2"
              >
                + Add Ingredient
              </button>
            </div>

            {/* Steps */}
            <div>
              <h3 className="font-semibold">Steps</h3>
              {steps.map((step, i) => (
                <div key={i} className="mt-2 border p-2 rounded">
                  <input
                    type="number"
                    min="1"
                    value={step.stepNumber}
                    onChange={(e) =>
                      handleStepChange(i, "stepNumber", e.target.value)
                    }
                    className="w-20 p-1 border rounded mr-2"
                    placeholder="Step #"
                  />
                  <textarea
                    value={step.instruction}
                    onChange={(e) =>
                      handleStepChange(i, "instruction", e.target.value)
                    }
                    placeholder="Instruction"
                    className="w-full p-2 border rounded mt-1"
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(setSteps, i)}
                      className="text-red-500 text-sm mt-1"
                    >
                      Remove Step
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  addField(setSteps, {
                    stepNumber: steps.length + 1,
                    instruction: "",
                  })
                }
                className="text-blue-600 mt-2"
              >
                + Add Step
              </button>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-semibold">Tags</h3>
              {tags.map((tag, i) => (
                <div key={i} className="flex gap-2 mt-2">
                  <input
                    value={tag}
                    onChange={(e) => handleArrayChange(setTags, i, e.target.value)}
                    placeholder={`Tag ${i + 1}`}
                    className="flex-1 p-2 border rounded"
                  />
                  {tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(setTags, i)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField(setTags, "")}
                className="text-blue-600 mt-2"
              >
                + Add Tag
              </button>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block font-semibold mb-1">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>

            {/* ✅ Video Section */}
            <div>
              <h3 className="font-semibold mb-1">Video Options</h3>
              {/* Option 1: Paste link */}
              <input
                type="url"
                name="video"
                placeholder="Paste video URL (YouTube, Cloudinary, Drive)"
                value={form.video}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-3"
              />
              {/* Option 2: Upload file */}
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                className="w-full"
              />
            </div>

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded w-full mt-4"
            >
              {editRecipe ? "Update Recipe" : "Create Recipe"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
