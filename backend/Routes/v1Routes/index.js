const userRouter=require('../v1Routes/userRoutes');
const adminRouter=require('../v1Routes/adminRoutes');
const recipeRouter=require('../v1Routes/recipeRoutes');
const reviewRouter = require('../v1Routes/reviewRoutes');
const athuRouter = require('../v1Routes/authRouter');
const v1Router=require('express').Router();

v1Router.use("/user",userRouter);
v1Router.use('/admin',adminRouter)
v1Router.use('/recipe',recipeRouter);
v1Router.use('/review',reviewRouter);
v1Router.use('/auth',athuRouter);

module.exports={v1Router};