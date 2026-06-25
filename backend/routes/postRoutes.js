const express = require("express");
const { createPost, toggleLike, getPosts, getUserPosts, addComment, deletePost, getTaggedPosts, deleteComment, toggleLikeComment, replyToComment, deleteReply, toggleLikeReply } = require("../Controllers/postController");
const router = express.Router();

router.post("/", createPost);
router.post("/:id/like", toggleLike);
router.post("/:id/comment", addComment);
router.delete("/:id/comment/:commentId", deleteComment);
router.post("/:id/comment/:commentId/like", toggleLikeComment);
router.post("/:id/comment/:commentId/reply", replyToComment);
router.delete("/:id/comment/:commentId/reply/:replyId", deleteReply);
router.post("/:id/comment/:commentId/reply/:replyId/like", toggleLikeReply);
router.delete("/:id", deletePost);
router.get("/", getPosts);
router.get("/user/:userId", getUserPosts);
router.get("/tagged/:userId", getTaggedPosts);

module.exports = router;
