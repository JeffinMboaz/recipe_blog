const Review = require('../Models/reviewModel');
const Recipe = require('../Models/recipeModel');

async function recalculateRecipeRating(recipeId) {
  const stats = await Review.aggregate([
    { $match: { recipe: recipeId } },
    {
      $group: {
        _id: '$recipe',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Recipe.findByIdAndUpdate(recipeId, {
      averageRating: stats[0].avgRating,
      totalReviews: stats[0].totalReviews,
    });
  } else {
    await Recipe.findByIdAndUpdate(recipeId, {
      averageRating: 0,
      totalReviews: 0,
    });
  }
}

module.exports = recalculateRecipeRating;
