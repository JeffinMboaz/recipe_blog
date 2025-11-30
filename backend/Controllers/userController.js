const userDb = require('../Models/userModel');
const { hashPassword, checkPassword } = require('../Utilities/passwordUtilities');
const { createToken } = require('../Utilities/generateToken');
const { uploadToCloudinary } = require('../Utilities/imageUpload');

const register = async (req, res) => {
    try {
        const { name, email, phone, password, confirmpassword, bio, title } = req.body;
        console.log("Incoming body:", req.body);
        if (!name || !email || !phone || !password || !confirmpassword) {
            return res.status(400).json({ error: "All fields are required." });
        }

        if (password !== confirmpassword) {
            return res.status(400).json({ error: "Passwords do not match." });
        }

        const existingUser = await userDb.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists." });
        }

        const hashedPassword = await hashPassword(password);

        let profile = '';
        if (req.file) {
            profile = await uploadToCloudinary(req.file.path);
        }
        console.log("Incoming file:", req.file);
        const newUser = new userDb({
            name,
            email,
            phone,
            password: hashedPassword,
            bio,
            title,
            profilePicture: profile,
        });

        const savedUser = await newUser.save();

        const token = createToken(savedUser._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            message: "User registration successful.",
            user: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};


// User Login Controller
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        // Check if user exists
        const userExist = await userDb.findOne({ email });
        if (!userExist) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check password
        const passwordMatch = await checkPassword(password, userExist.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: "Incorrect password." });
        }

        // Create JWT token (pass id and role separately so payload is { id, role })
        const token = createToken(userExist._id, "user");
        // const token = createToken(userExist._id, "user");


        // Store token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        // Respond
        return res.status(200).json({
            message: "User login successful.",
            user: { id: userExist._id, name: userExist.name, email: userExist.email },
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};


const userLogout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        return res.status(200).json({ message: "User logged out successfully." });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};


// const updateUserProfile = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     // Must be authenticated
//     if (!req.user) {
//       return res.status(401).json({ error: "Unauthorized." });
//     }

//     // Prevent users editing another profile
//     if (req.user.toString() !== userId.toString()) {
//       return res.status(403).json({ error: "Access denied." });
//     }

//     // Fetch user
//     const user = await userDb.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     const { name, phone, bio, title, password } = req.body;

//     // Update fields
//     if (name) user.name = name;
//     if (phone) user.phone = phone;
//     if (bio) user.bio = bio;
//     if (title) user.title = title;

//     // Handle password
//     if (password) {
//       user.password = await hashPassword(password);
//     }

//     // Handle profile picture
//     if (req.file) {
//       const image = await uploadToCloudinary(req.file.path);
//       user.profilePicture = image;
//     }

//     const updatedUser = await user.save();

//     return res.status(200).json({
//       message: "User profile updated successfully.",
//       user: updatedUser, // FIXED - sends _id to frontend
//     });

//   } catch (error) {
//     console.error("Update profile error:", error);
//     return res.status(500).json({ error: "Internal server error." });
//   }
// };


// Delete user controller

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.user) return res.status(401).json({ error: "Unauthorized." });
    if (req.user.toString() !== userId.toString())
      return res.status(403).json({ error: "Access denied." });

    const user = await userDb.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const updatableFields = ["name", "phone", "bio", "title"];
    updatableFields.forEach((field) => {
      if (req.body[field] && req.body[field] !== user[field]) {
        user[field] = req.body[field];
      }
    });

    // Handle password update
    if (req.body.password && req.body.password.trim() !== "") {
      user.password = await hashPassword(req.body.password);
    }

    // Handle image upload only if new file provided
    if (req.file) {
      const image = await uploadToCloudinary(req.file.path);
      user.profilePicture = image;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Ensure request comes from authenticated user
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized." });
        }

        if (req.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Access denied." });
        }

        // Check if user exists
        const user = await userDb.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Delete user
        await userDb.findByIdAndDelete(userId);

        // Clear token cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "User deleted successfully.",
        });

    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ error: "Internal server error." });
    }



};
const getUserProfile = async (req, res) => {
    try {
        const user = await userDb.findById(req.user).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        return res.status(200).json({ user }); // FIX: wrap response
    } catch (error) {
        console.error("Get user error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { register, userLogin, userLogout, updateUserProfile, deleteUser, getUserProfile };
