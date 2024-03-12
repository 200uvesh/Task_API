require("dotenv").config()
const nodemailer = require("nodemailer")


 

exports.sendResetPasswordMail= async ( email , otp , _id)=>{
    try {
        console.log("Me aa gya hu Utiils me  , hurry!!!")
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure:false,
            requireTLS:true , 
            auth: {
    
                user:  process.env.emailUser,
                pass:  process.env.passwordUser
            }
        }
    ) 
       const mailContent = {
        from:process.env.emailUser , 
        to:email,
        subject : 'For Reset Password' ,
        text: "Hello Welcome to the  world of API's  !! ",
        html : '<p> Hii   , Please copy the OTP '+otp+'   and ID is '+_id+' to  reset your password </p>',
        
        
       }

       transporter.sendMail(mailContent , (error , info)=>{
        if(error){
            console.log(error)
        }
        else{
            console.log("Mail has been sucessfully Send :- " + info.response)
        }
       })

      }
    catch (error) {
        console.log("Mail Not send")
        res.send("Mail not end")
        
    }
     };