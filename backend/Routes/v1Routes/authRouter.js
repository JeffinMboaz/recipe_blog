const express = require("express");
const { universalLogin, checkSession, logout, } = require("../../Controllers/authController");

const router = express.Router();

router.post("/login", universalLogin);
router.get("/check", checkSession);
router.post("/logout", logout);

module.exports = router;
