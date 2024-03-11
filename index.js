require("dotenv").config()
const express = require("express")
const app = express()
const {db} = require("./database/db.js")
db()



//Middlewares
// const methodOverride = require("method-override")
// const cors = require("cors")
// app.use(methodOverride('_method'))
// app.use(methodOverride('X-HTTP-Method-Override'));
// app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.set("view engine" , "ejs")


//UserRoute
const userRoute = require("./routes/routes.js")
app.use("/api" , userRoute)


//Home Route
app.get("/" , (req , res)=>{
    res.send(`Hii Iam From Server`)
})


//listner
const PORT = process.env.PORT
app.listen(PORT ,()=>{
    console.log(` Server  created sucessfully !! http://localhost:${PORT}`)
})

//m