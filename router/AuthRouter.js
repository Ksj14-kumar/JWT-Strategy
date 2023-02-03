const router = require("express").Router()
const User = require("../db/User")
const RateLimiter = require("../middleware/RateLimiter")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { auth } = require("../middleware/Auth")





router.post("/login", RateLimiter.ratelimit, async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(403).send("all fields are required")
        }
        // find user
        const user = await User.findOne({ email }).exec()
        if (!user) {
            return res.status(401).send("not login")
        }
        console.log(user)
        //matching password
        const match = await bcrypt.compare(password, user.password)
        console.log(match)
        if (!match) {
            return res.status(401).send("UnAuthorized")
        }
        // success full login, generate tokens
        const refreshToken = await jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" })
        const accessToken = await jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10s" })
        res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({ accessToken })
    } catch (err) {
        console.log(err)
        return res.status(500).send("something error occured")
    }

})


router.get("/refresh", async (req, res) => {
    try {
        const cookie = req.cookies
        console.log(req.cookies)
        if (!cookie?.jwt) {
            return res.status(401).send("unauthorized")
        }
        const token = cookie.jwt
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decode) => {
            if (err) {
                return res.status(401).send("unauthorized")
            }
            const user = await User.findOne({ email: decode.email })
            if (!user) {
                return res.status(403).send("forbidden")
            }
            const accessToken = await jwt.sign({ "email": user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10s" })
            return res.status(200).json(accessToken)
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send("something error occured")
    }
})


router.post("/logout", async (req, res) => {
    try {
        const cookie = req.cookies
        if (!cookie?.jwt) {
            return res.status(204).send("not content")
        }
        res.clearCookie("jwt", { httpOnly: true, sameSite: 'none', secure: true })
        return res.json("cleared successfull")
    } catch (err) {
        return res.status(500).send("something error occured")
    }
})
router.post("/register", async (req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(403).send("all fields are required")
        }
        const newUser = await new User({
            email,
            password: await bcrypt.hashSync(password, 10)
        })
        newUser.save((err) => {
            if (err) {
                return res.status(400).send("not save")
            }
            else {
                return res.status(200).send("save successfull")
            }
        })
    } catch (err) {
        return res.status(500).send("something error occured")
    }
})
router.get("/welcome", auth, (req, res) => {
    try {

        return res.send("hii")
    } catch (err) {
        console.log(err)
        return res.status(500).send("semehing error occured")
    }
})


module.exports = router