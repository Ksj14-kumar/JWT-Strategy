module.exports.ErrorHandler = function (err, req, res, next) {
    if (err) {
        console.log(err.stack)
        return res.status(500).send(err.message)
    }
    else {
        console.log(req.body)
        next()
    }
}