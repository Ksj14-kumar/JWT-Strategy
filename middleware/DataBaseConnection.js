const mongoose = require("mongoose")


const URL= process.env.DB_URL || "mongodb://localhost:27017/register"
mongoose.connect(URL, (err) => {
    if (err) {
        console.log("db not connect")
    }
    console.log("db is connected")
})
