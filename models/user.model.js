const mongoose = require("mongoose")

const user = mongoose.Schema(
    {
        username:{
            type : String,
            require : true,
            
        } ,
        email:{
            type : String,
            require : true,
            unique : true

        } , 
        password:{
            type : String,
            require : true,

        },
        otp:{
            type : Number, 
            default : 0

        },


    } ,
    
    {
        timestamps:true
    }

)
const User = mongoose.model("User" , user)
module.exports = User
