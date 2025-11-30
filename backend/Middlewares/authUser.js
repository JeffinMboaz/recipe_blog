

const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
  try {
    // Must match your login cookie name
    const token =
      req.cookies.auth_token || 
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    const verified = jwt.verify(token, process.env.SECRET_KEY);

    // JWT payload must include { id: user._id }
    if (!verified.id) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    if (verified.role !== "user") {
      return res.status(403).json({ error: "User access only" });
    }

    req.user = verified.id; // ALWAYS store user ID
    next();

  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

module.exports = { authUser };
