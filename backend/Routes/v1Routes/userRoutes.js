const express = require('express');
const { register, userLogin, userLogout, deleteUser, updateUserProfile, getUserProfile, } = require('../../Controllers/userController'); // or userController if renamed
const upload = require('../../Middlewares/multer');
const { authUser } = require('../../Middlewares/authUser');
const userRouter = express.Router();

// POST /api/v1/user/register
userRouter.post('/register', upload.single('profilePicture'), register);
userRouter.post('/login',userLogin)
userRouter.post('/logout',userLogout)
// Protect update and delete routes so only authenticated users can modify their own account
userRouter.put('/update/:id', authUser, upload.single('profilePicture'), updateUserProfile);
userRouter.delete('/delete/:id', authUser, deleteUser)
userRouter.get('/profile', authUser, getUserProfile);

module.exports = userRouter;
