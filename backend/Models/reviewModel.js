const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  review: {
    type: String,
    default: '',
  }
}, { timestamps: true });

// Prevent duplicate reviews per user/recipe
reviewSchema.index({ recipe: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
