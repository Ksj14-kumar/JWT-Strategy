const express = require("express")
const app = express()
require("dotenv").config()
const port = process.env.PORT || 5000
const router = require("./router/router")
const fs = require("fs")
const path = require("path")
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require("cors")
const Authrouter = require("./router/AuthRouter")
const originsWhitelist = require("./whiteList-Origin")
const { ErrorHandler } = require("./middleware/ErrorMiddleware")
const bodyParser = require("body-parser")
require("./middleware/DataBaseConnection") // conncted db
const employ= require("./router/Employ")




let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(helmet())
app.use(morgan("combined", { stream: accessLogStream }))
app.use(bodyParser.json({ limit: "100mb" }))
app.use(bodyParser.urlencoded({ extended: true, limit: "200mb" }))
app.use(cors({
    origin: (origin, callback) => {
        if (originsWhitelist.indexOf(origin) !== -1) {
            callback(null, true)
        }
        else {
            // callback(new Error("cors not allowed"))
            callback(null, true)
        }
    },
    allowedHeaders: ["Autherization", "Access-Token", "Content-Type", "Accept", "Access-Control-Allow-Origin"],
    allowedMethods: ["GET", "POST", "DELETE", "PATCH", "PUT"]
}))


app.use("/api/v1", router)
app.use("/api/v1/auth", Authrouter)
app.use("/api/v1/employ",employ)
console.log = require("./middleware/logger").log
app.use(ErrorHandler) //catch error globally
app.listen(port, (err) => {
    if (err) {
        console.log("server is not start at port", `http://localhost:${port}`)
    }
    console.log("server is start given port number")
    console.log(`http://localhost:${port}`)
})