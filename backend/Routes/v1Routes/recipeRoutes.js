const express = require('express');
const { authUser } = require('../../Middlewares/authUser');
const upload = require('../../Middlewares/multer');
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  getMyRecipes,
} = require('../../Controllers/recipeController');

const recipeRouter = express.Router();

recipeRouter.post(
  '/createrecipe',
  authUser,
  upload.fields([
    { name: 'images', maxCount: 5 },  // multiple images for homepage cards
    { name: 'video', maxCount: 1 }    // one preparation video for detail page
  ]),
  createRecipe
);

recipeRouter.get('/getallrecipe', getAllRecipes);
recipeRouter.get('/getonerecipe/:id', getRecipeById);
recipeRouter.put('/updaterecipe/:id', authUser, upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'video', maxCount: 1 }
]), updateRecipe);
recipeRouter.delete('/deleterecipe/:id', authUser, deleteRecipe);
recipeRouter.get('/search', searchRecipes);
recipeRouter.get("/myrecipes", authUser, getMyRecipes);
module.exports = recipeRouter;
