

const fs = require('fs');
const RecipeDB = require('../Models/recipeModel');
const { uploadImageToCloudinary, uploadVideoToCloudinary } = require('../Utilities/imageUpload');

// CREATE RECIPE
exports.createRecipe = async (req, res) => {
  try {
    const imageFiles = req.files?.images || [];
    const videoFile = req.files?.video ? req.files.video[0] : null;

    // Upload multiple images
    const imageUrls = [];
    for (const file of imageFiles) {
      const imageUrl = await uploadImageToCloudinary(file.path);
      imageUrls.push(imageUrl);
      fs.unlinkSync(file.path); // remove local file
    }

    // Upload video if provided
    let videoUrl = req.body.video || null; // optional YouTube or Cloudinary URL
    if (videoFile) {
      videoUrl = await uploadVideoToCloudinary(videoFile.path);
      fs.unlinkSync(videoFile.path);
    }

    // ✅ FIXED: req.user is already the user ID string
    const recipe = await RecipeDB.create({
      ...req.body,
      image: imageUrls,
      video: videoUrl,
      createdBy: req.user, // ✅ fixed
    });

    res.status(201).json({
      message: 'Recipe created successfully!',
      recipe,
    });
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.status(400).json({ error: err.message });
  }
};

// READ ALL RECIPES (for homepage cards)
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await RecipeDB.find().select('title image category difficulty createdAt');
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE (for detail page)
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await RecipeDB.findById(req.params.id).populate('createdBy', 'name email');
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await RecipeDB.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    // 🔹 Replace old images if new ones are uploaded
    let updatedImages = recipe.image || [];
    const imageFiles = req.files?.images || [];

    if (imageFiles.length > 0) {
      const newImageUrls = [];
      for (const file of imageFiles) {
        const imageUrl = await uploadImageToCloudinary(file.path);
        newImageUrls.push(imageUrl);
        fs.unlinkSync(file.path);
      }
      // ✅ Replace existing images completely
      updatedImages = newImageUrls;
    }

    // 🔹 Handle video
    let updatedVideo = recipe.video;
    const videoFile = req.files?.video ? req.files.video[0] : null;

    if (videoFile) {
      updatedVideo = await uploadVideoToCloudinary(videoFile.path);
      fs.unlinkSync(videoFile.path);
    } else if (req.body.video) {
      updatedVideo = req.body.video;
    }

    // 🔹 Update recipe fields
    recipe.title = req.body.title || recipe.title;
    recipe.description = req.body.description || recipe.description;
    recipe.category = req.body.category || recipe.category;
    recipe.difficulty = req.body.difficulty || recipe.difficulty;
    recipe.preparationTime = req.body.preparationTime || recipe.preparationTime;
    recipe.cookTime = req.body.cookTime || recipe.cookTime;

    // Ingredients, steps, tags
    recipe.ingredients = req.body["ingredients[]"] || recipe.ingredients;
    recipe.steps = req.body.steps || recipe.steps;
    recipe.tags = req.body["tags[]"] || recipe.tags;

    recipe.image = updatedImages;
    recipe.video = updatedVideo;

    const updatedRecipe = await recipe.save();

    res.status(200).json({
      message: "Recipe updated successfully!",
      recipe: updatedRecipe,
    });
  } catch (err) {
    console.error("Error updating recipe:", err);
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await RecipeDB.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SEARCH / FILTER RECIPES
exports.searchRecipes = async (req, res) => {
  try {
    const { search, category, tags, page = 1, limit = 20 } = req.query;

    const filter = {};

    // 🔍 Search by title, description or ingredients
    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive

      filter.$or = [
        { title: regex },
        { description: regex },
        { ingredients: regex },
        { tags: regex }
      ];
    }

    // 📌 Filter by category
    if (category) {
      filter.category = category;
    }

    // 🏷️ Filter by tags (supports multiple tags)
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      filter.tags = { $in: tagArray };
    }

    // 📄 Pagination
    const skip = (page - 1) * limit;

    const recipes = await RecipeDB.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select("title image category tags averageRating totalReviews createdAt");

    const total = await RecipeDB.countDocuments(filter);

    res.status(200).json({
      message: "Filtered recipes",
      totalResults: total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      recipes
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get logged-in user's recipes
exports.getMyRecipes = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    // ✅ FIXED: req.user is a string ID, not an object
    const recipes = await RecipeDB.find({ createdBy: req.user })
      .sort({ createdAt: -1 });

    res.status(200).json({ recipes });
  } catch (err) {
    console.error("MY RECIPES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
