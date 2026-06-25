const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const checkRequest = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
      token = req.cookies.token;
  }

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and attach it to the request (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};

module.exports = { checkRequest };
