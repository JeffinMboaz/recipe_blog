const Recipe = require('../Models/recipeModel');

exports.getTopReviewedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .sort({ totalReviews: -1 })
      .limit(10);

    res.status(200).json({
      message: 'Recommended Recipes',
      recipes
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
