const adminDb = require("../Models/adminModel");
const { createToken } = require("../Utilities/generateToken");
const { hashPassword, checkPassword } = require("../Utilities/passwordUtilities");
const Review = require("../Models/reviewModel");
const User = require("../Models/userModel");
const Recipe = require("../Models/recipeModel");
const mongoose = require("mongoose");
const fs = require('fs');
const { uploadImageToCloudinary, uploadVideoToCloudinary } = require('../Utilities/imageUpload');
const { get } = require("http");




const register = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are reqiured !" })
        }
        const alreadyExist = await adminDb.findOne({ email })
        if (alreadyExist) {
            return res.status(400).json({ error: "Admin already exist !" })
        }
        const hashedPassword = await hashPassword(password)//password from req body
        const newAdmin = new adminDb({
            email, password: hashedPassword
        })

        const saved = await newAdmin.save()
        if (!saved) {
            res.status(400).json({ error: "admin not saved" })
        } else {
            res.status(200).json({ message: "Admin registration successfull !" })
        }

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })

    }
}

const login = async (req, res) => {
   try {
     const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" })
    }
    const adminExist = await adminDb.findOne({ email })
    if (!adminExist) {
        return res.status(400).json({ error: "Admin not found !" })
    }

    const passwordMatch= await checkPassword(password,adminExist.password)
    if (!passwordMatch) {
        return res.status(400).json({ error: "pasword does not match" })
    }

   const token=createToken(adminExist._id,"admin")
   res.cookie("Admin_token",token)
   return res.status(200).json({message:"Admin login successful",adminExist})
   
   } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({error:error.message ||"internal server error"})
    
   }

}

const logout =async (req,res) => {
    try {
        res.clearCookie("Admin_token")
        res.status(200).json({message:"Admin logout successful"})
        
    } catch (error) {
          console.log(error);
    res.status(error.status || 500).json({error:error.message ||"internal server error"})
    
    }
}

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const totalReviews = await Review.countDocuments();

    res.json({
      totalUsers,
      totalRecipes,
      totalReviews
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





// --------------------- MANAGE RECIPES ---------------------
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "name email profilePicture");
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user", "name email profilePicture").populate("recipe", "title"); 
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin Create Recipe
const adminAddRecipe = async (req, res) => {
  try {
    const imageFiles = req.files?.images || [];
    const videoFile = req.files?.video ? req.files.video[0] : null;

    // ---------------------------
    // 1️⃣ Parse steps[] manually
    // ---------------------------
    const steps = Object.keys(req.body)
      .filter(key => key.startsWith("steps["))
      .reduce((acc, key) => {
        const match = key.match(/steps\[(\d+)\]\[(\w+)\]/);

        if (match) {
          const index = Number(match[1]);
          const field = match[2];

          if (!acc[index]) acc[index] = {};
          acc[index][field] = req.body[key];
        }
        return acc;
      }, []);

    // ---------------------------
    // 2️⃣ Parse ingredients[]
    // ---------------------------
    const ingredients = Array.isArray(req.body.ingredients)
      ? req.body.ingredients
      : req.body.ingredients ? [req.body.ingredients] : [];

    // ---------------------------
    // 3️⃣ Parse tags[]
    // ---------------------------
    const tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags ? [req.body.tags] : [];

    // ---------------------------
    // 4️⃣ Upload images
    // ---------------------------
    const imageUrls = [];
    for (const file of imageFiles) {
      const imageUrl = await uploadImageToCloudinary(file.path);
      imageUrls.push(imageUrl);
      fs.unlinkSync(file.path);
    }

    // ---------------------------
    // 5️⃣ Upload video
    // ---------------------------
    let videoUrl = req.body.video || null;
    if (videoFile) {
      videoUrl = await uploadVideoToCloudinary(videoFile.path);
      fs.unlinkSync(videoFile.path);
    }

    // ---------------------------
    // 6️⃣ Create recipe
    // ---------------------------
    const recipe = await Recipe.create({
      title: req.body.title,
      description: req.body.description,
      preparationTime: req.body.preparationTime,
      cookTime: req.body.cookTime,
      difficulty: req.body.difficulty,
      ingredients,
      steps,        // parsed correctly now
      category: req.body.category,
      tags,
      image: imageUrls,
      video: videoUrl,
      createdBy: req.admin, // admin creates it
    });

    return res.status(201).json({
      message: "Recipe created successfully by admin!",
      recipe,
    });

  } catch (err) {
    console.error("Admin Recipe Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// const adminUpdateRecipe = async (req, res) => {
//   try {
//     const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });

//     if (!recipe) return res.status(404).json({ message: "Recipe not found" });

//     res.json({ message: "Recipe updated", recipe });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const adminUpdateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const existingRecipe = await Recipe.findById(id);
    if (!existingRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Parse arrays (ingredients, tags)
    const ingredients = Array.isArray(req.body.ingredients)
      ? req.body.ingredients
      : req.body.ingredients
      ? [req.body.ingredients]
      : existingRecipe.ingredients;

    const tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags
      ? [req.body.tags]
      : existingRecipe.tags;

    // Parse steps
    const steps = Object.keys(req.body)
      .filter((key) => key.startsWith("steps["))
      .reduce((acc, key) => {
        const match = key.match(/steps\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const index = Number(match[1]);
          const field = match[2];
          if (!acc[index]) acc[index] = {};
          acc[index][field] = req.body[key];
        }
        return acc;
      }, []);

    // Handle uploads
    const imageFiles = req.files?.images || [];
    const videoFile = req.files?.video ? req.files.video[0] : null;

    let imageUrls = existingRecipe.image;
    let videoUrl = existingRecipe.video;

    if (imageFiles.length > 0) {
      imageUrls = [];
      for (const file of imageFiles) {
        const url = await uploadImageToCloudinary(file.path);
        imageUrls.push(url);
        fs.unlinkSync(file.path);
      }
    }

    if (videoFile) {
      videoUrl = await uploadVideoToCloudinary(videoFile.path);
      fs.unlinkSync(videoFile.path);
    }

    // Update recipe
    existingRecipe.title = req.body.title || existingRecipe.title;
    existingRecipe.description = req.body.description || existingRecipe.description;
    existingRecipe.preparationTime = req.body.preparationTime || existingRecipe.preparationTime;
    existingRecipe.cookTime = req.body.cookTime || existingRecipe.cookTime;
    existingRecipe.difficulty = req.body.difficulty || existingRecipe.difficulty;
    existingRecipe.category = req.body.category || existingRecipe.category;
    existingRecipe.ingredients = ingredients;
    existingRecipe.tags = tags;
    existingRecipe.steps = steps.length > 0 ? steps : existingRecipe.steps;
    existingRecipe.image = imageUrls;
    existingRecipe.video = videoUrl;

    const updatedRecipe = await existingRecipe.save();
    res.status(200).json({ message: "✅ Recipe updated successfully!", recipe: updatedRecipe });
  } catch (err) {
    console.error("Update Recipe Error:", err);
    res.status(500).json({ error: err.message });
  }
};

const adminDeleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Recipe ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted by admin" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// --------------------- MANAGE REVIEWS ---------------------
const adminDeleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewId);

    if (!review) return res.status(404).json({ message: "Review not found" });

    res.json({ message: "Review deleted by admin" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------- MANAGE USERS ---------------------
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email createdAt profilePicture");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const adminDeleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete all user reviews
    await Review.deleteMany({ user: userId });

    return res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = { register,login,logout
,getDashboardStats,getAllRecipes,
adminAddRecipe,adminUpdateRecipe,
adminDeleteRecipe,adminDeleteReview,
getAllUsers,adminDeleteUser,getAllReviews
}