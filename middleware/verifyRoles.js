module.exports = (...roles) => {
    return function (req, res, next) {
        console.log({ req: req.roles })
        if (!req?.roles) return res.sendStatus(401)
        const userRoles = [...roles]
        console.log({ userRoles })
        console.log(req.roles)
        const maping = req.roles.map(item => userRoles.includes(item))
        console.log(maping)
        console.log(maping.find(item => item === true));
        const checkRolesExitinOurRolesData = req.roles.map(item => userRoles.includes(item)).find(item => item === true)
        if (!checkRolesExitinOurRolesData) {
            return res.sendStatus(401)
        }
        next()
    }
}