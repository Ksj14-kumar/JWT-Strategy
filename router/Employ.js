const router = require("express").Router()
const path = require("path")
const fs = require("fs")
const verifyRoles = require("../middleware/verifyRoles")
const Roles = require("../config/Roles")
const AuthMidd = require("../middleware/Auth")
router.get("/", async (req, res) => {
    const employessFilePath = path.join(__dirname, "..", "db/Employees.json")
    try {
        const readFile = JSON.parse(await fs.readFileSync(employessFilePath))
        return res.status(200).send(readFile)
    } catch (err) {
        return res.status(500).send("something error occured")
    }
})

router.delete("/:id", [AuthMidd.auth, verifyRoles(Roles.Admin, Roles.Editor)], async (req, res) => {
    const employessFilePath = path.join(__dirname, "..", "db/Employees.json")
    try {
        const readFile = JSON.parse(await fs.readFileSync(employessFilePath))
        const id = req.params.id
        const findUser = readFile.filter(item => {
            return item.id != id
        })
        console.log({ findUser })
        await fs.writeFileSync(employessFilePath, JSON.stringify(findUser))
        return res.status(200).send("deleted")
    } catch (err) {
        return res.status(500).send("something error occured")
    }
})


router.post("/add", [AuthMidd.auth, verifyRoles(Roles.Admin)], async (req, res) => {
    const employessFilePath = path.join(__dirname, "..", "db/Employees.json")
    try {
        console.log(req.body)
        const { name } = req.body


        const readFile = await fs.readFileSync(employessFilePath)
        // const id= req.params.id
        // const findUser= readFile.filter(item=>item.id!==id)
        // console.log({findUser})
        const makeJSON = readFile.length != 0 ? [
            ...JSON.parse(readFile),
            {
                name,
                id: Math.floor(Math.random() * 1000)
            }] : [{
                name,
                id: Math.floor(Math.random() * 1000)
            }]
        await fs.writeFileSync(employessFilePath, JSON.stringify(makeJSON))
        return res.status(200).send("added")
    } catch (err) {
        console.log(err)
        return res.status(500).send("something error occured")
    }
})


module.exports = router