require("dotenv").config()
const jwt= require("jsonwebtoken")

const verifyToken=async function(req , res , next){

   
    // const token = req.cookies.jwtToken 
   const token = req.header("Authorization")?.replace("Bearer ", "")  
    //  console.log(token)
   if(!token){
       return res.status(400).json(
           {
               message:"Not Authrozied"
           }
       )
   }
    jwt.verify(token , process.env.JWT_SECRET_KEY , (error , payload)=>{
       if(error){
           return res.status(400).json({
               message:"Token Is Invalid"
           })
       }
       else{
           
        //    console.log("You Have sucessfully verified and Get Details !! :--> ")
        //    console.log(payload)
          
            req.details=payload
            
            
           next()

       }        
})
}
module.exports = verifyToken


