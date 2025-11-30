const express = require('express');
const reviewRouter = express.Router();

const { createReview, updateReview, getRecipeReviews, deleteReview, getAllReview, getMyReviews } = require('../../Controllers/reviewController');
const recommendationController = require('../../Controllers/recommendationController');
const { authUser } = require('../../Middlewares/authUser');
const { getAllRecipes } = require('../../Controllers/recipeController');

// Reviews
reviewRouter.post('/addreview/:recipeId', authUser, createReview);
reviewRouter.get('/getreview/:recipeId', getRecipeReviews);
reviewRouter.put('/updatereview/:reviewId', authUser, updateReview);
reviewRouter.delete('/deletereview/:reviewId', authUser, deleteReview);
reviewRouter.get('/allreviews',getAllReview);
// Recommendations
reviewRouter.get('/top-ratedreview', recommendationController.getTopReviewedRecipes);
reviewRouter.get("/myreviews", authUser, getMyReviews);
module.exports = reviewRouter;
