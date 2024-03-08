const User= require("../models/user.model.js")
const addDetail = require("../models/details.model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

 //Register
exports.register=  async(req , res)=>{
    const {username , email , password} = req.body
         try{
            if( username===""|| email==="" , password ===""){
                console.log(`Please enter valid inputs`)
                res.status(401).json({message:"Please enter valid inputs"})
            }
            else{
            
            const already_exist=  await User.findOne({email: email}) || await User.findOne({username: username})
            
            if(!already_exist){
                const data =  await User.create({
                    username , 
                    email,
                    password : bcrypt.hashSync(password)

                })
                
                 
                await data.save()
                
                const createdUser = await User.findById(data._id).select(
                    "-password"
                )
              
                const payload = {
                    _id : User._id , 
                    username : data.username  , 
                    email: data.email, 
                    
                  }
                
                  jwt.sign(payload , process.env.JWT_SECRET_KEY , (error , token)=>{
                      if(error){
                         
                          throw error
                      }
                       
                        res.cookie( "jwtToken" , token ,
                        { httpOnly: true, 
                            secure: false, 
                            expires:new Date(Date.now()+25892000000)
                        })
                      console.log("Cookies Set Sucessfully")
                      console.log(token)
                     
                      res.status(200).json({message:"Register Sucess !! " , createdUser})
                    //   res.redirect("/addPersonalDetails")
                    
                  } )

            }
        
            else{
                res.status(409).json({message :"Email or username  is already registered"})
                console.log("Email is alreday registered")
            }
         }
        }
    catch(err){
        console.log("Something went wrong")
        res.status(500).json("Something went wrong")
    }
}  

//Login
exports.login = async (req , res)=>{
    try {

        const { email , password} =  req.body
        if( email==="" , password ===""){
            console.log(`Please enter valid inputs`)
            res.status(401).json({message:"Please enter valid inputs"})
        }
        else{
        
        
        const data = await User.findOne({email:email})
       
        if(data){
             
           const hashPassword =  data.password
        //    console.log(hashPassword)
        //    console.log(data.password)
           const isMatch = await bcrypt.compare( password ,hashPassword)
           console.log(isMatch)
         
           //bcrypt.compare(req.body.password,RegisterUser.password)
          
            if(isMatch){
                const payload = {
                    _id:data._id,
                    username :  data.username  , 
                    email: email, 
                      
                  }
                
                  jwt.sign(payload , process.env.JWT_SECRET_KEY ,   (error , token)=>{
                      if(error){
                         
                          throw error
                      }
                       
                        res.cookie( "jwtToken" , token ,
                        { httpOnly: true, 
                            secure: false, 
                            expires:new Date(Date.now()+25892000000)
                        })
                      console.log("Cookies Set Sucessfully")
                 
            })
            const loggedUser =  await User.findById(data._id).select("-password")
                 
            console.log("Login Sucess")
          
             res.status(200).json({message :"Login Sucess !!" , loggedUser})
            // res.redirect("/userPage")
            
        }
            else{
                console.log(" Password is Incorrect")   
                res.status(400).json({message:" Password is Incorresct"})
               
            }
        }
    
        else{
            console.log("Email or Password is Incorresct")
            res.status(400).send("Email or Password is Incorresct")
             
        }    
    
    }
    } catch (error) {
        console.log(`Something Wrnt Wrong`)
        res.status(500).json({message:"Something Wrnt Wrong"})
        
    }
}
 
//Add Details
exports.addDetail=async(req , res)=>{
    try{
        const { fullName  , address , pincode , age} = req.body
        if(fullName ==="" || address==="" , pincode==="" , age===""){
            console.log("All fields are required")
            res.status(400).send({message: "All fields are required"})
        }
        else{
            const registerDetails = await User.findById(req.details._id).select("-password")
            const email = registerDetails.email
            console.log(email)
            
         
       const data = await addDetail.create({
        fullName ,
        address,
        pincode ,
        age , 
        email
       })

        
       console.log("Personal Details saved sucessfull !!")
       const details = await addDetail.findById(data._id)
       console.log(data)
      
        
     
       //res.redirect("/userPage")
        res.status(200).send( {message:"Personal Details saved sucessfull !!" , registerDetails ,details})
         
        }
    }
    catch(error){
        console.log("Error is Occured : " +error )
        res.status(500).send(error)

    } 
 }


// get details 
exports.getDetails = async(req , res)=>{
  
    try{

        const registerDetails = await User.findById(req.details._id).select("-password")
        const email = registerDetails.email
        console.log(email)
        const personalDetails = await addDetail.findOne({email:email}).select("-email")

        res.status(201).json(
            {
              message: "Here the details " , 
              registerDetails ,
              personalDetails

            }
        )

    }
    catch(error){
        console.log("Something went wrong " + error)
        res.status(504).send(error)

    }
}


// Update username 
exports.updateUsername= async(req , res)=>{
     
    try{
         const {oldUsername , newUsername} = req.body

       const isCheck = await User.findOne({username:oldUsername})
       if(!isCheck){
          console.log("Old Username is not correct ! ! ")
          res.status(400).json( {message:"Old Username is not correct ! ! "})
       }
       else{
        await User.findByIdAndUpdate(req.details._id, {$set:{username:newUsername}})
        console.log("Username  Updated sucessfully !!!")
        res.status(201).json({message:"Username  Updated sucessfully !!!"})

       }
         
    }
    catch(error){
        console.log("Something Went Wrong Error is :  " + error)
         res.status(500).json({message:"Something Went Wrong" , error})

    }
}


// update email
exports.updateEmail= async(req , res)=>{
     
    try{
         const {oldEmail , newEmail} = req.body

       const isCheck = await User.findOne({email:oldEmail})
       if(!isCheck){
          console.log("Old Email is not correct ! ! ")
          res.status(400).json({message:"Old Email is not correct ! ! "})
       }
       else{
        await User.findByIdAndUpdate(req.details._id, {$set:{email:newEmail}})
        console.log("Email  Updated sucessfully !!!")
        res.status(201).json({message:"Email  Updated sucessfully !!!"})

       }
         
    }
    catch(error){
        console.log("Something Went Wrong Error is :  " + error)
         res.status(500).json({message:"Something Went Wrong" , error})

    }
}



// update password
exports.updatePassword=async(req , res)=>{

    
    try{
      
        const {oldPassword , newPassword} = req.body
         
       const registerData = await User.findById(req.details._id)
        
       
       const isCheck = await bcrypt.compare(oldPassword,registerData.password )  
       
       if(!isCheck){
          console.log("Password is not correct ! ! ")
          res.status(400).json({message:"Password is notcorrect ! ! "})
       }
       else{
        await User.findByIdAndUpdate(req.details._id , {$set:{password: bcrypt.hashSync(newPassword)}})
         console.log("Password  Updated sucessfully !!!")
         res.status(201).json({message:"Password  Updated sucessfully !!!"})

       }
          
    }
    catch(error){
        console.log("Something Went Wrong Error is :  " + error)
        res.status(500).json({error:error})

    }


}

//delete user
exports.deleteUser= async(req , res)=>{
     
        try{
            const password = req.body
    
           const data = await User.findById(req.details._id)
           const UserPassword =  data.password
             const isMatched = await bcrypt.compare(password ,UserPassword)
            
             if(!isMatched){


              console.log(" Username or password is not correct ! ! ")
              res.status(200).json({message:" Username or password is not correct ! ! "})
             }
             else{
          
            await User.findByIdAndDelete(req.details._id)
            await addDetail.deleteOne({email:isMatched.email})
            // res.clearCookie("jwtToken")
            res.setHeader('Authorization' , "")
            console.log("  Account delete Sucessfully ")
            // res.redirect('/register')
            res.status(201).json({message:"Account delete Sucesfully"})
    
             }
        }
        catch(error){
            console.log("Something Went Wrong Error is :  " + error)
            res.status(500).json({message:"Something Went Wrong !! "})
    
        }
    
    }
    
 

//logout


 