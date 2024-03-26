const expres = require("express")
const router = expres.Router()

const {homePage , register , login , addDetails  , userPage  , updateDetails  , deleteUser , logout , updateUsername ,updateEmail , updatePassword , getDetails , forgotPassword , resetPassword  , getUserDetails , addProfilePicture , updateProfilePicture  , removeProfilePicture} = require("../../controllers/views/controller")

//HomePages
router.get('/' , getDetails)
router.get('/homePage' , homePage)
router.get('/userPage' , userPage)

//Auth
router.get('/register' , register)
router.get('/login' , login)
router.get('/logout' , logout)

//CRUD-operations
router.get('/addDetails' , addDetails)
router.get('/getDetails' , getDetails)
router.get('/getUserDetails' , getUserDetails )
router.get('/updateDetails' , updateDetails)
router.get('/updateUsername' , updateUsername)
router.get('/updateEmail' , updateEmail)
router.get('/updatePassword' , updatePassword)
router.get('/deleteUser' , deleteUser )
router.get("/forgotPassword" , forgotPassword)
router.get("/resetPassword" , resetPassword)

//Uploading File
router.get("/addProfilePicture" , addProfilePicture)
router.get("/updateProfilePicture" , updateProfilePicture)
router.get("/removeProfilePicture" , removeProfilePicture)



 

module.exports = router
