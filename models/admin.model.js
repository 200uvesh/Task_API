const mongoose = require("mongoose")

const admin = mongoose.Schema(
    {
         
        email:{
            type : String,
            require : true,
            unique : true

        } , 
        token:{
            type:String  , 
            require :true
        }

    } ,
    
    {
        timestamps:true
    }

)
const Admin = mongoose.model("Admin" , admin)
module.exports = Admin
