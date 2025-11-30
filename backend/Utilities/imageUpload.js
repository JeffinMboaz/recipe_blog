
const cloudinary = require('../config/cloudinaryConfig');

const uploadImageToCloudinary = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, {
      folder: 'RecipeImage',
      resource_type: 'image'
    }, (err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
  });
};

const uploadVideoToCloudinary = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, {
      folder: 'RecipeVideo',
      resource_type: 'video'
    }, (err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
  });
};

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "profile_pictures",
    });

    return result.secure_url; // we return only the URL
  } catch (err) {
    console.error("Cloudinary upload error:", err.message);
    throw new Error("Image upload failed");
  }
};

module.exports = { uploadImageToCloudinary, uploadVideoToCloudinary , uploadToCloudinary };
