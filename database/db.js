// connect project with database mongo_DB
const mongoose = require("mongoose")
require("dotenv").config()
exports.db= async()=>{
    const URI = process.env.DB_URI
    try{
         await mongoose.connect(`${URI}`)
        console.log(` Sucessfully connected to MongoDB `)
    }
    catch(error){
        console.log(`Something went wrong :  ${error}`)
    
    }
}
 