
const express = require("express");
const {
  register,
  login,
  logout,
  getDashboardStats,
  getAllRecipes,
  getAllUsers,
  getAllReviews,
  adminAddRecipe,
  adminUpdateRecipe,
  adminDeleteRecipe,
  adminDeleteReview,
  adminDeleteUser,
} = require("../../Controllers/adminController");
const { authAdmin } = require("../../Middlewares/authAdmin");
const upload = require("../../Middlewares/multer");

const adminRouter = express.Router();

// Admin Auth
adminRouter.post("/register", register);
adminRouter.post("/login", login);
adminRouter.post("/logout", logout);

// Dashboard
adminRouter.get("/stats", authAdmin, getDashboardStats);

// Recipes
adminRouter.get("/allrecipes", authAdmin, getAllRecipes);
adminRouter.post(
  "/addrecipe",
  authAdmin,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  adminAddRecipe
);
adminRouter.put(
  "/updaterecipe/:id",
  authAdmin,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  adminUpdateRecipe
);
adminRouter.delete("/deleterecipe/:id", authAdmin, adminDeleteRecipe);

// Reviews
adminRouter.get("/allreviews", authAdmin, getAllReviews);
adminRouter.delete("/deletereview/:reviewId", authAdmin, adminDeleteReview);

// Users
adminRouter.get("/allusers", authAdmin, getAllUsers);
adminRouter.delete("/deleteuser/:userId", authAdmin, adminDeleteUser);

module.exports = adminRouter;
