const mongoose = require("mongoose")

const detail = mongoose.Schema(
    {
        fullName:{
            type : String,
            require : true,
           
        } ,
        address:{
            type : String,
            require : true,
           
        } , 
        pincode:{
          type : Number ,
          require : true
        } ,
        age:{
            type : Number,
            require : true,

        },
        email:{
            type : String,
            
        } , 
        // owner:{
        //     type: Schema.Types.ObjectId,
        //     ref: "User"
            
        // }
        // access by Details.owner.email , prediction
         
        username:{
            type :String

        }
        ,
        image: {
            type: String, // cloudinary url
            default : ""
             
        },



    } ,
    {
        timestamps:true
    }

)
const Details = mongoose.model("Details" , detail)
module.exports = Details
