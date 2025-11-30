

const jwt = require("jsonwebtoken"); // ✅ <-- ADD THIS LINE
const adminDb = require("../Models/adminModel");
const userDb = require("../Models/userModel");
const { checkPassword } = require("../Utilities/passwordUtilities");
const { createToken } = require("../Utilities/generateToken");

// ======================== LOGIN CONTROLLER ========================
const universalLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    // Check for admin first
    let account = await adminDb.findOne({ email });
    let role = "admin";

    // If admin not found → check user
    if (!account) {
      account = await userDb.findOne({ email });
      role = "user";
    }

    if (!account)
      return res.status(404).json({ error: "Account not found" });

    // Validate password
    const isMatch = await checkPassword(password, account.password);
    if (!isMatch)
      return res.status(400).json({ error: "Incorrect password" });

    // Generate token { id, role }
    const token = createToken(account._id, role);

    // Store in cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",   // ✅ secure only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✅ allow cross-site cookies
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });


    return res.json({
      message: "Login successful",
      role,
      id: account._id,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const checkSession = async (req, res) => {
  try {
    const token =
      req.cookies.auth_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.json({ isLoggedIn: false });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    let user = null;
    if (decoded.role === "user")
      user = await userDb.findById(decoded.id).select("-password");
    else if (decoded.role === "admin")
      user = await adminDb.findById(decoded.id).select("-password");

    if (!user) return res.json({ isLoggedIn: false });

    res.json({ isLoggedIn: true, role: decoded.role, user });
  } catch (err) {
    console.error("Session check error:", err);
    res.json({ isLoggedIn: false });
  }
};

const logout = (req, res) => {
   res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res.json({ message: "Logged out successfully" });
};
module.exports = { universalLogin, checkSession , logout };
