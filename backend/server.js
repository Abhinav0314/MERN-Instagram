require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbconnect = require("./config/db");
const path = require("path");

const app = express();

// Connect to Database
dbconnect();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));
app.use(express.json());
app.use(cookieParser());

const csrfMiddleware = require("./middleware/csrfMiddleware");
app.use(csrfMiddleware);

// Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/upload", uploadRoutes);

// Cloudinary is used for uploads now, so no local static folder serving is needed.

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({
        name: "Instagram API",
        version: "1.0.0",
        description: "A simple API for Instagram Users",
        author: "Abhinav Verma"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});