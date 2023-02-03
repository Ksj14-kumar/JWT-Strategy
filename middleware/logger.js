const fs = require("fs")
const path = require("path")
const utl = require("util")

module.exports.log = function (d) {
    fs.createWriteStream(path.join(__dirname + "/.."+"/log.log"), { flags: "a" }).write(utl.format(d) + "\n")
    process.stdout.write(utl.format(d) + "\n")
}