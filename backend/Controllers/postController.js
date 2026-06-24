const Post = require("../models/postModel");
const jwt = require("jsonwebtoken");

const createPost = async (req, res) => {
    try {
        const { caption, imageUrl } = req.body;
        
        // Extract token using split(" ")[1]
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        const newPost = await Post.create({
            user: userId,
            caption,
            imageUrl
        });

        res.status(201).json({ success: true, post: newPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleLike = async (req, res) => {
    try {
        const postId = req.params.id;

        // Extract token using split(" ")[1] as requested
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        
        // Splitting the Bearer token
        const token = authHeader.split(" ")[1];
        
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Check if the user has already liked the post
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // Unlike: Remove the userId from the likes array
            post.likes = post.likes.filter((id) => id.toString() !== userId);
        } else {
            // Like: Add the userId to the likes array
            post.likes.push(userId);
        }

        await post.save();

        res.status(200).json({
            success: true,
            message: isLiked ? "Post unliked" : "Post liked",
            likesCount: post.likes.length,
            likes: post.likes
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "username email").sort({ createdAt: -1 });
        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createPost, toggleLike, getPosts };
