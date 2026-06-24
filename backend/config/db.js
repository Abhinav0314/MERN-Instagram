const mongoose = require("mongoose");

const dbconnect = async ()=>{
    await mongoose.connect("mongodb://localhost:27017/instagram").then((conn)=>{
        console.log("Database connection established")
    }).catch((err) => {
        console.error("Database connection failed:", err.message);
    });
}

module.exports = dbconnect;