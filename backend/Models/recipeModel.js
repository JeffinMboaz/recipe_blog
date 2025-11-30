// const mongoose = require('mongoose');

// const recipeSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   preparationTime: { type: String, required: true },
//   cookTime: { type: String },
//   difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
//   ingredients: { type: [String], required: true },
//   steps: [{
//     stepNumber: Number,
//     instruction: { type: String, required: true },
//   }],
//   category: { type: String, required: true },
//   tags: [{ type: String }],
//   image: [{ type: String, required: true }],
//   video: {
//     type: String,
//     validate: {
//       validator: function (v) {
//         if (!v) return true;
//         return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|drive\.google\.com|cloudinary\.com|res\.cloudinary\.com)/.test(v);
//       },
//       message: props => `${props.value} is not a valid video URL`
//     }
//   },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   averageRating: { type: Number, default: 0 },
//   totalReviews: { type: Number, default: 0 },

// }, { timestamps: true });

// module.exports = mongoose.model('Recipe', recipeSchema);
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    preparationTime: { type: String, required: true },
    cookTime: { type: String },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    ingredients: { type: [String], required: true },
    steps: [
      {
        stepNumber: Number,
        instruction: { type: String, required: true },
      },
    ],
    category: { type: String, required: true },
    tags: [{ type: String }],
    image: [{ type: String, required: true }],
    video: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|drive\.google\.com|cloudinary\.com|res\.cloudinary\.com)/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid video URL`,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipe must have a creator"],
    },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
