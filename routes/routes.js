const express = require("express")
const router = express.Router()
const  {register, login, addDetail, getDetails, updateUsername, updateEmail, updatePassword, deleteUser}= require("../controllers/controllers.js")
const isAuthorised = require("../middlewares/auth.js")


//Routes
router.post("/register" , register)
router.get("/login" , login)
router.post("/addDetails" ,isAuthorised ,addDetail)
router.get("/getDetails" , isAuthorised , getDetails)
router.put("/updateUsername" , isAuthorised , updateUsername)
router.put("/updateEmail" , isAuthorised , updateEmail)
router.put("/updatePassword" , isAuthorised , updatePassword)
router.delete("/deleteUser" ,isAuthorised, deleteUser)




module.exports = router