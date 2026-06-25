const express = require("express");
const { register, loginUser, getProfile, logout, followUser, unfollowUser, getMe, toggleSavePost, getSavedPosts, editProfile } = require("../Controllers/userController");
const router = express.Router();

router.post("/register", register);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.put("/profile", editProfile);
router.post("/logout", logout);
router.post("/follow/:id", followUser);
router.post("/unfollow/:id", unfollowUser);
router.get("/me", getMe);
router.post("/save/:postId", toggleSavePost);
router.get("/saved", getSavedPosts);

module.exports = router;