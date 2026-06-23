const express = require("express");
const cors = require("cors");
const dbconnect = require("./config/db");

const app = express();

// Connect to Database
dbconnect();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");

app.use("/api/v1/user", userRoutes);

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