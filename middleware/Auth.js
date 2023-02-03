const jwt= require("jsonwebtoken")

module.exports.auth =async (req, res, next) => {
    try {
        const accessToken = req.headers["Authorization"] || req.headers["authorization"] || req.body.token || req.cookies.jwt
        console.log({accessToken})
        if(!accessToken.startsWith("Bearer ")){
            return res.status(401).send("unauthorization")
        }
        const takeToken= accessToken.split(" ")[1]
        console.log(takeToken)
        const verifyToken= await jwt.verify(takeToken,process.env.ACCESS_TOKEN_SECRET)

        if (!verifyToken) {
            return res.status(401).send("Unauthorization")
        }
        console.log(verifyToken)
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).send("something error occured")
    }
}