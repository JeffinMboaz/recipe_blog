const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const maxAge = 3 * 24 * 60 * 60; // 3 days

const createToken = (id, role = "user") => {
  if (!process.env.SECRET_KEY) {
    throw new Error("Missing SECRET_KEY in environment variables");
  }
  return jwt.sign({ id, role }, process.env.SECRET_KEY, { expiresIn: maxAge });
};

module.exports = { createToken };
