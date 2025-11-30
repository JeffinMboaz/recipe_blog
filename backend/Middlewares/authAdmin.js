const jwt = require("jsonwebtoken");

const authAdmin = (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    if (!token)
      return res.status(401).json({ error: "Token missing" });

    const verified = jwt.verify(token, process.env.SECRET_KEY);

    if (verified.role !== "admin")
      return res.status(403).json({ error: "Admin access only" });

    req.admin = verified.id;
    next();

  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

module.exports = { authAdmin };
