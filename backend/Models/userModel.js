
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {
    type: String,
    required: true,
  },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '', minlength: 3, maxlength: 100 },
  title: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
