// const Review = require('../Models/reviewModel');
// const Recipe = require('../Models/recipeModel');
// const recalculateRating = require('../Utilities/recalculateRating');

// // Create Review
// const createReview = async (req, res) => {
//   try {
//     const { recipeId } = req.params;
//     const { rating, review } = req.body;
//     const userId = req.user; // FIXED — userId is direct string

//     const recipe = await Recipe.findById(recipeId);
//     if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

//     const newReview = await Review.create({
//       recipe: recipeId,
//       user: userId,
//       rating,
//       review
//     });

//     await recalculateRating(recipeId);

//     res.status(201).json({
//       message: 'Review added successfully',
//       review: newReview
//     });

//   } catch (err) {
//     if (err.code === 11000) {
//       return res.status(400).json({ message: 'You already reviewed this recipe' });
//     }
//     res.status(500).json({ error: err.message });
//   }
// };
// //  const getAllReview = async (req, res) => {
// //   try {
// //     const reviews = await Review.find();
// //     res.status(200).json(reviews);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };
// const getAllReview = async (req, res) => {
//   try {
//     const reviews = await Review.find()
//       .populate("user", "name profilePicture email") // ✅ include name + profile picture
//       .populate("recipe", "title image") // optional — include recipe info if you want
//       .sort({ createdAt: -1 });

//     res.status(200).json(reviews);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// // Get Reviews
// const getRecipeReviews = async (req, res) => {
//   try {
//     const { recipeId } = req.params;

//     const reviews = await Review.find({ recipe: recipeId })
//       .populate('user', 'name email');

//     res.status(200).json(reviews);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update Review
// const updateReview = async (req, res) => {
//   try {
//     const { reviewId } = req.params;
//     const userId = req.user; // FIXED

//     const updated = await Review.findOneAndUpdate(
//       { _id: reviewId, user: userId },
//       req.body,
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: 'Review not found or unauthorized' });
//     }

//     await recalculateRating(updated.recipe);

//     res.json({ message: 'Review updated', updated });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Delete Review
// const deleteReview = async (req, res) => {
//   try {
//     const { reviewId } = req.params;
//     const userId = req.user; // FIXED

//     const deleted = await Review.findOneAndDelete({
//       _id: reviewId,
//       user: userId
//     });

//     if (!deleted) {
//       return res.status(404).json({ message: 'Review not found or unauthorized' });
//     }

//     await recalculateRating(deleted.recipe);

//     res.json({ message: 'Review deleted' });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ✅ FIXED
// const getMyReviews = async (req, res) => {
//   try {
//     const { recipeId } = req.params;

//     const reviews = await Review.find({ recipe: recipeId })
//       .populate('user', 'name email profilePicture') // ✅ Include profilePicture
//       .sort({ createdAt: -1 }); // optional, newest first

//     res.status(200).json(reviews);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// module.exports = {
//   createReview,
//   getRecipeReviews,
//   updateReview,
//   deleteReview,getAllReview,getMyReviews
// };

const Review = require('../Models/reviewModel');
const Recipe = require('../Models/recipeModel');
const recalculateRating = require('../Utilities/recalculateRating');

// ✅ Create Review
const createReview = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user; // userId from auth middleware

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const newReview = await Review.create({
      recipe: recipeId,
      user: userId,
      rating,
      review,
    });

    await recalculateRating(recipeId);

    // Populate user info before returning
    const populatedReview = await newReview.populate('user', 'name email profilePicture');

    res.status(201).json({
      message: 'Review added successfully',
      review: populatedReview,
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this recipe' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Reviews (for admin or debugging)
const getAllReview = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email profilePicture')
      .populate('recipe', 'title image')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Reviews for a Specific Recipe (main frontend route)
const getRecipeReviews = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const reviews = await Review.find({ recipe: recipeId })
      .populate('user', 'name email profilePicture') // ✅ fixed here
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user;

    const updated = await Review.findOneAndUpdate(
      { _id: reviewId, user: userId },
      req.body,
      { new: true }
    ).populate('user', 'name email profilePicture');

    if (!updated) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    await recalculateRating(updated.recipe);

    res.json({ message: 'Review updated', review: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user;

    const deleted = await Review.findOneAndDelete({
      _id: reviewId,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    await recalculateRating(deleted.recipe);

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get My Reviews (if needed for a profile or dashboard)
const getMyReviews = async (req, res) => {
  try {
    const userId = req.user;

    const reviews = await Review.find({ user: userId })
      .populate('recipe', 'title image')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createReview,
  getAllReview,
  getRecipeReviews,
  updateReview,
  deleteReview,
  getMyReviews,
};
