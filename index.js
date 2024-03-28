require("dotenv").config()
const express = require("express")
const app = express()
const {db} = require("./database/db.js")
db()
const cookieParser = require("cookie-parser")





//Middlewares
const methodOverride = require("method-override")
const cors = require("cors")
app.use(methodOverride('_method'))
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cookieParser("secret"));
app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
 
app.set("view engine" , "ejs")



//UserRoute
const userRoute = require("./routes/api/routes.js")
app.use("/api" , userRoute)


//Home Route
const viewRoute = require("./routes/views/routes.js")
app.use("/" , viewRoute)


 

//listner
const PORT = process.env.PORT || 6543
app.listen(PORT ,()=>{
    console.log(` Server  created sucessfully !! http://localhost:${PORT}`)
})


// Check 
// const uploadOnCloudinary = require("./utils/cloudnary.js")
// uploadOnCloudinary('/home/uvesh/Downloads/Profile1.jpg')