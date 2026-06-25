const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "Username, email, and password are required" });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this username or email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ username, email, password: hashedPassword });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "30d"
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            domain: process.env.NODE_ENV === "production" ? undefined : "localhost",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: { _id: newUser._id, username: newUser.username, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password are required" });
        }

        const user = await User.findOne({ username });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!user || !isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d"
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: { _id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const followUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        
        let currentUserId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            currentUserId = decoded.id;
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        if (currentUserId === targetUserId) {
            return res.status(400).json({ success: false, message: "You cannot follow yourself" });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!currentUser.following.includes(targetUserId)) {
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
            await currentUser.save();
            await targetUser.save();
            return res.status(200).json({ success: true, message: "User followed successfully" });
        } else {
            return res.status(400).json({ success: false, message: "You are already following this user" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const unfollowUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        
        let currentUserId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            currentUserId = decoded.id;
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        if (currentUserId === targetUserId) {
            return res.status(400).json({ success: false, message: "You cannot unfollow yourself" });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (currentUser.following.includes(targetUserId)) {
            currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
            await currentUser.save();
            await targetUser.save();
            return res.status(200).json({ success: true, message: "User unfollowed successfully" });
        } else {
            return res.status(400).json({ success: false, message: "You are not following this user" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies.token;
        const token = cookieToken || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleSavePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        
        const cookieToken = req.cookies.token;
        const authHeader = req.headers.authorization;
        const token = cookieToken || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

        if (!token) return res.status(401).json({ success: false, message: "No token provided" });
        
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.savedPosts.includes(postId)) {
            user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId.toString());
        } else {
            user.savedPosts.push(postId);
        }

        await user.save();
        res.status(200).json({ success: true, message: "Post save toggled successfully", savedPosts: user.savedPosts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSavedPosts = async (req, res) => {
    try {
        const cookieToken = req.cookies.token;
        const authHeader = req.headers.authorization;
        const token = cookieToken || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

        if (!token) return res.status(401).json({ success: false, message: "No token provided" });
        
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        const user = await User.findById(userId).populate({
            path: 'savedPosts',
            populate: { path: 'user', select: 'username' }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, posts: user.savedPosts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const editProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies.token;
        const token = cookieToken || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

        if (!token) return res.status(401).json({ success: false, message: "No token provided" });
        
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        const { name, username, email, bio, profilePicture } = req.body;

        // Check if another user already has the new username or email
        if (username || email) {
            const existingUser = await User.findOne({
                $and: [
                    { _id: { $ne: userId } },
                    { $or: [{ username: username }, { email: email }] }
                ]
            });
            
            if (existingUser) {
                if (existingUser.username === username) {
                    return res.status(400).json({ success: false, message: "Username is already taken" });
                }
                if (existingUser.email === email) {
                    return res.status(400).json({ success: false, message: "Email is already in use" });
                }
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, username, email, bio, profilePicture },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { register, loginUser, getProfile, logout, followUser, unfollowUser, getMe, toggleSavePost, getSavedPosts, editProfile };