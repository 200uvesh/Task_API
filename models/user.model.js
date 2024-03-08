const mongoose = require("mongoose")

const user = mongoose.Schema(
    {
        username:{
            type : String,
            require : true,
            unique : true
        } ,
        email:{
            type : String,
            require : true,
            unique : true

        } , 
        password:{
            type : String,
            require : true,

        }


    } ,
    {
        timestamps:true
    }

)
const User = mongoose.model("User" , user)
module.exports = User
