const jwt = require("jsonwebtoken")
const roles = require("../config/Roles")

module.exports.auth = async (req, res, next) => {
    try {
        const accessToken = req.headers["Authorization"] || req.headers["authorization"]
        console.log({ accessToken })
        if (!accessToken.startsWith("Bearer ")) {
            return res.status(401).send("unauthorization")
        }
        const takeToken = accessToken.split(" ")[1]
        const verifyToken = await jwt.verify(takeToken, process.env.ACCESS_TOKEN_SECRET)

        if (!verifyToken) {
            return res.status(401).send("Unauthorization")
        }
        console.log(verifyToken.UserInfo.roles)
        req.roles = Object.values(verifyToken.UserInfo.roles) // [adminCode, editorCode, UserCode]
        req.email = verifyToken.UserInfo.email
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).send("something error occured")
    }
}