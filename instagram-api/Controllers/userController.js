const User = require("../models/userModel");

const bcrypt = require("bcrypt");

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

        res.status(201).json({
            success: true,
            message: "User registered successfully",
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

        res.status(200).json({
            success: true,
            message: "Login successful",
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

module.exports = { register, loginUser, getProfile };