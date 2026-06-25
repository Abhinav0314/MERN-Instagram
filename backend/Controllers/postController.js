const Post = require("../models/postModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createPost = async (req, res) => {
    try {
        const { caption, imageUrl, taggedUsernames } = req.body;
        
        // Extract token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        let taggedUsersIds = [];
        if (taggedUsernames && taggedUsernames.length > 0) {
            const users = await User.find({ username: { $in: taggedUsernames } });
            taggedUsersIds = users.map(u => u._id);
        }

        const newPost = await Post.create({
            user: userId,
            caption,
            imageUrl,
            taggedUsers: taggedUsersIds
        });

        res.status(201).json({ success: true, post: newPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleLike = async (req, res) => {
    try {
        const postId = req.params.id;

        // Extract token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
        const posts = await Post.find()
            .populate("user", "username email profilePicture")
            .populate({ path: "comments.user", select: "username profilePicture" })
            .populate({ path: "comments.replies.user", select: "username profilePicture" })
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ user: userId })
            .populate("user", "username email profilePicture")
            .populate({ path: "comments.user", select: "username profilePicture" })
            .populate({ path: "comments.replies.user", select: "username profilePicture" })
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { text } = req.body;
        
        // Extract token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        post.comments.push({
            user: userId,
            text
        });

        await post.save();

        // return the populated post or just the comment
        const updatedPost = await Post.findById(postId)
            .populate("user", "username email profilePicture")
            .populate({ path: "comments.user", select: "username profilePicture" })
            .populate({ path: "comments.replies.user", select: "username profilePicture" });

        res.status(201).json({ success: true, post: updatedPost });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });
        
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Check if user owns post. post.user could be an object if populated, or ObjectId
        const postOwnerId = post.user._id ? post.user._id.toString() : post.user.toString();
        if (postOwnerId !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTaggedPosts = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const posts = await Post.find({ taggedUsers: targetUserId })
            .populate("user", "username profilePicture")
            .populate("comments.user", "username profilePicture")
            .populate("comments.replies.user", "username profilePicture")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        const comment = post.comments.id(commentId);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

        const postOwnerId = post.user._id ? post.user._id.toString() : post.user.toString();
        const commentOwnerId = comment.user._id ? comment.user._id.toString() : comment.user.toString();

        if (postOwnerId !== userId && commentOwnerId !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this comment" });
        }

        comment.deleteOne();
        await post.save();

        const updatedPost = await Post.findById(id).populate("user", "username email profilePicture").populate({ path: "comments.user", select: "username profilePicture" }).populate({ path: "comments.replies.user", select: "username profilePicture" });
        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleLikeComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        const comment = post.comments.id(commentId);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

        const isLiked = comment.likes.includes(userId);
        if (isLiked) {
            comment.likes = comment.likes.filter((uid) => uid.toString() !== userId);
        } else {
            comment.likes.push(userId);
        }

        await post.save();
        
        const updatedPost = await Post.findById(id).populate("user", "username email profilePicture").populate({ path: "comments.user", select: "username profilePicture" }).populate({ path: "comments.replies.user", select: "username profilePicture" });
        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const replyToComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const { text } = req.body;
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        const comment = post.comments.id(commentId);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

        comment.replies.push({ user: userId, text });
        await post.save();

        const updatedPost = await Post.findById(id).populate("user", "username email profilePicture").populate({ path: "comments.user", select: "username profilePicture" }).populate({ path: "comments.replies.user", select: "username profilePicture" });
        res.status(201).json({ success: true, post: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteReply = async (req, res) => {
    try {
        const { id, commentId, replyId } = req.params;
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        const comment = post.comments.id(commentId);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

        const reply = comment.replies.id(replyId);
        if (!reply) return res.status(404).json({ success: false, message: "Reply not found" });

        const postOwnerId = post.user._id ? post.user._id.toString() : post.user.toString();
        const replyOwnerId = reply.user._id ? reply.user._id.toString() : reply.user.toString();

        if (postOwnerId !== userId && replyOwnerId !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this reply" });
        }

        reply.deleteOne();
        await post.save();

        const updatedPost = await Post.findById(id).populate("user", "username email profilePicture").populate({ path: "comments.user", select: "username profilePicture" }).populate({ path: "comments.replies.user", select: "username profilePicture" });
        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleLikeReply = async (req, res) => {
    try {
        const { id, commentId, replyId } = req.params;
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        const comment = post.comments.id(commentId);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

        const reply = comment.replies.id(replyId);
        if (!reply) return res.status(404).json({ success: false, message: "Reply not found" });

        const isLiked = reply.likes.includes(userId);
        if (isLiked) {
            reply.likes = reply.likes.filter((uid) => uid.toString() !== userId);
        } else {
            reply.likes.push(userId);
        }

        await post.save();

        const updatedPost = await Post.findById(id).populate("user", "username email profilePicture").populate({ path: "comments.user", select: "username profilePicture" }).populate({ path: "comments.replies.user", select: "username profilePicture" });
        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createPost, toggleLike, getPosts, getUserPosts, addComment, deletePost, getTaggedPosts, deleteComment, toggleLikeComment, replyToComment, deleteReply, toggleLikeReply };
