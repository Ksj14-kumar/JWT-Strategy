

const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    email: String,
    password: String
})

module.exports = mongoose.model("users", Schema)