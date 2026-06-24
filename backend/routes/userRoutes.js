const express = require("express");
const { register, loginUser, getProfile } = require("../Controllers/userController");
const router = express.Router();

router.post("/register", register);
router.post("/login", loginUser);
router.get("/profile", getProfile);

module.exports = router;