const express = require("express");
const { createPost, toggleLike, getPosts } = require("../Controllers/postController");
const router = express.Router();

router.post("/", createPost);
router.post("/:id/like", toggleLike);
router.get("/", getPosts);

module.exports = router;
