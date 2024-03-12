const express = require("express")
const router = express.Router()
const  {register, login, addDetail, getDetails, updateUsername, updateEmail, updatePassword, deleteUser, logout, forgotPassword, resetPassword}= require("../../controllers/api/controllers.js")
const isAuthorised = require("../../middlewares/auth.js")



//Routes
router.post("/register" , register)
router.post("/login" , login)
router.post("/addDetails" ,isAuthorised ,addDetail)
router.get("/getDetails" , isAuthorised , getDetails)
router.put("/updateUsername" , isAuthorised , updateUsername)
router.put("/updateEmail" , isAuthorised , updateEmail)
router.put("/updatePassword" , isAuthorised , updatePassword)
router.delete("/deleteUser" ,isAuthorised, deleteUser)
router.get("/logout" ,isAuthorised , logout)
router.post("/forgotPassword" , forgotPassword)
router.post("/resetPassword" , resetPassword)






module.exports = router