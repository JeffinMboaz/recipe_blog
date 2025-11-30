import React, { useState } from "react";
import { admAddRecipe } from "../../services/adminServices";

export default function AddRecipe() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    preparationTime: "",
    cookTime: "",
    difficulty: "Easy",
    category: "",
  });

  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([{ stepNumber: 1, instruction: "" }]);
  const [tags, setTags] = useState([""]);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ===== INGREDIENTS =====
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };
  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index) =>
    setIngredients(ingredients.filter((_, i) => i !== index));

  // ===== STEPS =====
  const handleStepChange = (index, key, value) => {
    const updated = [...steps];
    updated[index][key] = value;
    setSteps(updated);
  };
  const addStep = () =>
    setSteps([...steps, { stepNumber: steps.length + 1, instruction: "" }]);
  const removeStep = (index) => {
    const updated = steps.filter((_, i) => i !== index);
    const renumbered = updated.map((step, i) => ({
      ...step,
      stepNumber: i + 1,
    }));
    setSteps(renumbered);
  };

  // ===== TAGS =====
  const handleTagChange = (index, value) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };
  const addTag = () => setTags([...tags, ""]);
  const removeTag = (index) => setTags(tags.filter((_, i) => i !== index));

  // ===== MEDIA =====
  const handleImageChange = (e) => setImages([...e.target.files]);
  const handleVideoChange = (e) => setVideo(e.target.files[0]);

  // ===== SUBMIT =====

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  const data = new FormData();
  Object.keys(formData).forEach((key) => data.append(key, formData[key]));
  ingredients.forEach((ing) => data.append("ingredients", ing));
  tags.forEach((tag) => data.append("tags", tag));
  steps.forEach((step, i) => {
    data.append(`steps[${i}][stepNumber]`, step.stepNumber);
    data.append(`steps[${i}][instruction]`, step.instruction);
  });
  images.forEach((img) => data.append("images", img));
  if (video) data.append("video", video);

  try {
    const res = await admAddRecipe(data);
    const result = res.data;

    alert("🎉 Recipe created successfully!");
    setMessage("✅ Recipe created successfully!");

    // Reset form
    setFormData({
      title: "",
      description: "",
      preparationTime: "",
      cookTime: "",
      difficulty: "Easy",
      category: "",
    });
    setIngredients([""]);
    setSteps([{ stepNumber: 1, instruction: "" }]);
    setTags([""]);
    setImages([]);
    setVideo(null);
  } catch (err) {
    console.error("❌ Recipe creation error:", err);
    const errorMsg = err.response?.data?.error || err.message;
    alert(`❌ ${errorMsg}`);
    setMessage(`❌ ${errorMsg}`);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex justify-center items-start py-6 sm:py-10 px-3 sm:px-6 lg:px-8 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white shadow-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-gray-200 transition-all duration-300"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-8">
          🍽️ Create a New Recipe
        </h2>

        {/* === BASIC DETAILS === */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Preparation Time
            </label>
            <input
              type="text"
              name="preparationTime"
              value={formData.preparationTime}
              onChange={handleChange}
              placeholder="e.g. 20 minutes"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Cook Time
            </label>
            <input
              type="text"
              name="cookTime"
              value={formData.cookTime}
              onChange={handleChange}
              placeholder="e.g. 45 minutes"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm sm:text-base"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Difficult">Difficult</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Dessert, Main Course"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm sm:text-base"
            />
          </div>
        </section>

        {/* === DESCRIPTION === */}
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a short recipe description..."
            rows="4"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm sm:text-base"
          />
        </div>

        {/* === INGREDIENTS === */}
        <section className="mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
            Ingredients
          </h3>
          {ingredients.map((ing, i) => (
            <div key={i} className="relative mb-2">
              <input
                type="text"
                value={ing}
                onChange={(e) => handleIngredientChange(i, e.target.value)}
                placeholder={`Ingredient ${i + 1}`}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm sm:text-base"
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-red-600 text-lg"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="text-sm sm:text-base text-orange-600 hover:underline"
          >
            + Add Ingredient
          </button>
        </section>

        {/* === STEPS === */}
        <section className="mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">Steps</h3>

          {steps.map((s, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
            >
              {/* Step Header with Delete Button */}
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-700 text-sm sm:text-base">
                  Step {s.stepNumber}
                </p>
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="text-gray-400 hover:text-red-600 text-lg font-bold"
                    title="Remove this step"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="number"
                  value={s.stepNumber}
                  onChange={(e) =>
                    handleStepChange(i, "stepNumber", e.target.value)
                  }
                  placeholder="Step number"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm sm:text-base"
                />
                <textarea
                  value={s.instruction}
                  onChange={(e) =>
                    handleStepChange(i, "instruction", e.target.value)
                  }
                  placeholder="Instruction"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm sm:text-base"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addStep}
            className="text-sm sm:text-base text-orange-600 hover:underline"
          >
            + Add Step
          </button>
        </section>

        {/* === TAGS === */}
        <section className="mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
            Tags
          </h3>
          {tags.map((tag, i) => (
            <div key={i} className="relative mb-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(i, e.target.value)}
                placeholder={`Tag ${i + 1}`}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm sm:text-base"
              />
              {tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-red-600 text-lg"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTag}
            className="text-sm sm:text-base text-orange-600 hover:underline"
          >
            + Add Tag
          </button>
        </section>

        {/* === MEDIA UPLOADS === */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              📸 Upload Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              🎥 Upload Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
            />
          </div>
        </section>

        {/* === SUBMIT BUTTON === */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 sm:px-10 rounded-full transition-all duration-300 text-sm sm:text-base"
          >
            Submit Recipe
          </button>
        </div>

        {/* === MESSAGE === */}
        {message && (
          <p
            className={`mt-6 text-center font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"
              } text-sm sm:text-base`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
