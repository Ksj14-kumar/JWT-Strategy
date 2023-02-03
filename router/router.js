
const router=require("express").Router()

router.get("/",(req, res)=>{
    try {
        return res.send("successs")
    } catch (err) {
        return res.status(500).json({message:"something error  occured"})
    }
})



module.exports= router