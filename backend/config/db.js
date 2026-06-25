const mongoose = require("mongoose");

const dbconnect = async ()=>{
    await mongoose.connect(process.env.MONGO_URI).then((conn)=>{
        console.log("Database connection established")
    }).catch((err) => {
        console.error("Database connection failed:", err.message);
    });
}

module.exports = dbconnect;