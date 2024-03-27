require("dotenv").config()
const User = require("../../models/user.model.js")
const addDetail = require("../../models/details.model.js")
const Admin = require("../../models/admin.model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {sendResetPasswordMail} = require("../../utils/sendMail.js")
const {uploadOnCloudinary , deleteOnCloudnary} = require("../../utils/cloudnary.js")
// const upload = require("../../middlewares/upload.js")
 


//Register API
exports.register=  async(req , res)=>{
    const {username , email , password} = req.body
    console.log(username , email , password)
         try{
            if( username===""|| email==="" , password ===""){
                console.log(`Please enter valid inputs`)
                res.status(401).json({message:"Please enter valid inputs"})
            }
            else{
            
            const already_exist=  await User.findOne({email: email}) || await User.findOne({username: username})
            
            if(!already_exist){
                const hasedPassword = bcrypt.hashSync(password)
                const data =  await User.create({
                    username , 
                    email,
                    password :hasedPassword

                })
                
                const createdUser = await User.findById(data._id).select(
                    "-password"
                )
              
                const payload = {
                    _id : data._id , 
                    username : data.username  , 
                    email: data.email, 
                    
                  }
                   
                
                   jwt.sign(payload , process.env.JWT_SECRET_KEY , async(error , token)=>{
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


                      const admin =  await Admin.create({
                        email:createdUser.email , 
                        token : token
    
                    })
                    //   res.redirect("/addDetails")
                      res.status(200).json({message:"Register Sucess !! " , createdUser , admin})
                     
                    
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
        res.status(500).json({message:"Something went wrong : " , err})
    }
}  



//Login API
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body
        if (email === "", password === "") {
            console.log(`Please enter valid inputs`)
            res.status(401).json({ message: "Please enter valid inputs" })
        }
        else {

     
            const data = await User.findOne({email:email})


            
            // console.log(_id , username , email)

            if (data) {
                

                const hashPassword = data.password
                //    console.log(hashPassword)
                //    console.log(data.password)
                const isMatch = await bcrypt.compare(password, hashPassword)
                 

                //bcrypt.compare(req.body.password,RegisterUser.password)
                 
                if (isMatch) {
                    const payload = {
                    _id :data._id , 
                    username : data.username  , 
                    email: data.email, 

                    }
                   
                    jwt.sign(payload, process.env.JWT_SECRET_KEY, (error, token) => {
                        if (error) {

                            throw error
                        }
                        else{
                            
                        

                        res.cookie("jwtToken", token,
                            {
                                httpOnly: true,
                                secure: false,
                                expires: new Date(Date.now() + 25892000000)
                            })
                        }
                        console.log("Cookies Set Sucessfully")

                    })
                    const loggedUser = await User.findById(data._id).select("-password")

                    console.log("Login Sucess")

                    // res.redirect("/userPage")
                    res.status(200).json({ message: "Login Sucess !!", loggedUser })
                   
                }
                else {
                    console.log(" Password is Incorrect")
                    res.status(400).json({ message: " Password is Incorresct" })

                }
            }

            else {
                console.log("Email or Password is Incorresct")
                res.status(400).json({message:"Email or Password is Incorresct"})

            }

        }
    } catch (error) {
        console.log(`Something Wrnt Wrong`)
        res.status(500).json({ message: "Something Wrnt Wrong : " , error })

    }
}


//Add Details API
exports.addDetail = async (req, res) => {
    try {
        const { fullName, address, pincode, age } = req.body
        if (fullName === "" || address === "", pincode === "", age === "") {
            console.log("All fields are required")
            res.status(400).send({ message: "All fields are required" })
        }
        else {
            console.log(req.details._id)
            const registerDetails = await User.findById(req.details._id).select("-password")
            console.log(registerDetails)
            const { username, email } = registerDetails
            console.log(email)


            const data = await addDetail.create({
                fullName,
                address,
                pincode,
                age,
                username,
                email
            })


            console.log("Personal Details saved sucessfull !!")
            const details = await addDetail.findById(data._id)
            console.log(data)



            // res.redirect("/userPage")
            res.status(200).send({ message: "Personal Details saved sucessfull !!", details })
        }
    }
    catch (error) {
        console.log("Error is Occured : " + error)
        res.status(500).json({message:"Something went wrong : " , error})

    }
}


// get details API
exports.getDetails = async (req, res) => {

    try {

        const registerDetails = await User.findById(req.details._id).select("-password")
        const
            { email } = registerDetails
        console.log(email)


        const personalDetails = await addDetail.findOne({ email: email })

        res.status(201).json(
            {
                message: "Here the details ",
                personalDetails

            }
        )

    }
    catch (error) {
        console.log("Something went wrong " + error)
        res.status(504).json({message:"Something went wrong : " , error})

    }
}



// Update username API
exports.updateUsername = async (req, res) => {

    try {
        const { oldUsername, newUsername } = req.body

        const isCheck = await User.findOne({ username: oldUsername })
        if (!isCheck) {
            console.log("Old Username is not correct ! ! ")
            res.status(400).json({ message: "Old Username is not correct ! ! " })
        }
        else {
            await User.findByIdAndUpdate(req.details._id, { $set: { username: newUsername } })
            console.log("Username  Updated sucessfully !!!")
            const userDetails  = await  User.findById(req.details._id).select("-password")
            res.status(201).json({ message: "Username  Updated sucessfully !!!" , userDetails })

        }

    }
    catch (error) {
        console.log("Something Went Wrong Error is :  " + error)
        res.status(500).json({ message: "Something Went Wrong : ", error })

    }
}


// update email API
exports.updateEmail = async (req, res) => {

    try {
        const { oldEmail, newEmail } = req.body

        const isCheck = await User.findOne({ email: oldEmail })
        if (!isCheck) {
            console.log("Old Email is not correct ! ! ")
            res.status(400).json({ message: "Old Email is not correct ! ! " })
        }
        else {
            await addDetail.findOneAndUpdate({email: oldEmail} , { $set: { email: newEmail }})
            await Admin.findOneAndUpdate({email:oldEmail} ,  {$set:{email:newEmail}})
            await User.findByIdAndUpdate(req.details._id, { $set: { email: newEmail } })
             
            console.log("Email  Updated sucessfully !!!")
            const userDetails  = await  User.findById(req.details._id).select("-password")
            
            res.status(201).json({ message: "Email  Updated sucessfully !!!" , userDetails })

        }

    }
    catch (error) {
        console.log("Something Went Wrong Error is :  " + error)
        res.status(500).json({ message: "Something Went Wrong : ", error })

    }
}




// update password API
exports.updatePassword = async (req, res) => {

    try {

        const { oldPassword, newPassword } = req.body

        const registerData = await User.findById(req.details._id)


        const isCheck = await bcrypt.compare(oldPassword, registerData.password)

        if (!isCheck) {
            console.log("Password is not correct ! ! ")
            res.status(400).json({ message: "Password is notcorrect ! ! " })
        }
        else {
            await User.findByIdAndUpdate(req.details._id, { $set: { password: bcrypt.hashSync(newPassword) } })
            console.log("Password  Updated sucessfully !!!")
            const userDetails  = await  User.findById(req.details._id).select("-password")
            res.status(201).json({ message: "Password  Updated sucessfully !!!"  , userDetails})

        }

    }
    catch (error) {
        console.log("Something Went Wrong Error is :  " + error)
        res.status(500).json({ message:"Something went wrong : " ,  error })

    }

}



//delete user API
exports.deleteUser = async (req, res) => {
    
    try {
        const {password} = req.body
        const data = await User.findById(req.details._id)
        const UserPassword = data.password
        const isMatched = await bcrypt.compare(password, UserPassword)
        console.log(isMatched)

        if (!isMatched) {

            console.log(" Username or password is not correct ! ! ")
            res.status(200).json({ message: " Username or password is not correct ! ! " })
        }
        else {
            const registerData = await User.findById(req.details._id)
            await User.findByIdAndDelete(req.details._id)
            await addDetail.deleteOne({ email: registerData.email })
            await Admin.deleteOne({email: registerData.email})
            res.clearCookie("jwtToken")
            // res.redirect('/register')
            res.status(201).json({ message: "Account delete Sucesfully" })

        }
    }
    catch (error) {
        console.log("Something Went Wrong Error is :  " + error)
        res.status(500).json({ message: "Something Went Wrong : " , error })

    }

}



//logout API
exports.logout = async (req, res) => {
    try {
        res.clearCookie("jwtToken")
        console.log("Logout Sucess!! ")
        // res.redirect('/register')
       res.status(201).json({message:"You Have Logout Sucessfully !!"})
        
    } catch (error) {
        console.log({message:"Something Went Wrong"})
        res.status(500).json({message:"Something went wrong : " , error})
        
    }

}


 

// forgotPassword API
exports.forgotPassword = async(req , res)=>{
    try{
         const {email} = req.body
         console.log(email)
        const registerData = await User.findOne({email:email})
        console.log(registerData)
        console.log(registerData._id)
        if(registerData){
           // Generate a random 4-digit number
              function generateOTP() {
                 return Math.floor(Math.random() * 9000) + 1000;
                 }
                 const otp = generateOTP();
                 console.log(otp)

            await  User.updateOne({email:email} ,{$set:{otp:otp}})
            sendResetPasswordMail( email , otp , registerData._id )
           console.log(registerData._id)
          res.status(201).json({message:"Email Send Sucessfully !!"} )
        //   res.redirect(`/resetPassword?_id=${registerData._id}`)
        }
        else{
            console.log("Email is not Defined")
            res.status(300).json({message:" Email is not found !! "})
        }
        

    }
    catch(error){
        console.log("Something Went Wrong : "+ error)
        res.status(500).json({message:"Something went Wrong : " , error })

    }

}

//Reset Password API
exports.resetPassword = async (req , res)=>{
    try {
        console.log("I am in Reset password API")
        const {otp ,newPassword , _id} = req.body
        console.log(req.query._id) 
        const RegisterUser = await User.findById(_id)
        
        if(!RegisterUser){
            console.log("User _id or password is not matched")
            res.status(300).json({message:"User _id or password is not matched"})

        }
        else{
            if(RegisterUser.otp == otp){
               console.log("Otp is matched")
               await User.findByIdAndUpdate(_id , {$set:{password: bcrypt.hashSync(newPassword) , otp:0}})
               console.log("Below the Update OTP")
               const userRegistered =  await User.findById(_id)
               console.log("bellow thw find by Id")
               console.log(userRegistered)
               res.status(201).json({message:"New password Saved Sucessfully" , userRegistered})

            }
            else{
                console.log("OTP is not correct please try again")
                res.status(300).json({message:"OTP is not correct please try again"})

            }
        
        }
       
    } catch (error) {
        // console.log("Something went Wrong : " + error)
        res.status(500).json({message:"Something Went Wrong : " , error})
        
    }

}
 




//add Profile Picture API
exports.addProfilePicture = async(req , res)=>{
    
    try {
        const registerDetails = await User.findById(req.details._id).select("-password")
        const details = await addDetail.findOne({email:registerDetails.email})
        if(details.image){
            console.log("You can't add Image becuse image is  alredy added")
            res.status(300).json({message:"You can't add Image becuse image is  alredy added"})
           
        }
        else{
            console.log(req.file.path)
            const imagePath = req.file.path
            const response =  await uploadOnCloudinary(imagePath)
            console.log(response.url)
            
        const
            { email } = registerDetails

         await addDetail.findOneAndUpdate( {email: email}  , {$set :{image:response.url}})
         const personalDetails = await addDetail.findOne({email:email})
         console.log(personalDetails)


            res.status(201).json({ message: 'Profile picture uploaded successfully!'  , personalDetails});
          }
        }
    

  catch (error) {
        
        console.log("Something Went Wrong : "+ error)
        res.status(400).json({message:"Something Went Wrong :" , error})
        
    }

}



//update Profile Picture API
exports.updateProfilePicture = async(req , res)=>{
    try {
       
        
        const registerDetails = await User.findById(req.details._id).select("-password")
        const details = await addDetail.findOne({email:registerDetails.email})
        if(!details.image){
            console.log("You can't update image becuse image is not add yet")
            res.status(300).json({message:"You can't update image becuse image is not add yet"})
           
        }
        else{
            // Logic for extraction 
        const parts = details.image.split('/');
        const stringAfterLastSlash = parts[parts.length - 1];
        const finalPublicID = stringAfterLastSlash.replace('.jpg', '');
        console.log(finalPublicID); // Output: x9df9nfagsgp2ydtpd7f
        const deletedImage =  await deleteOnCloudnary(finalPublicID)
        console.log(deletedImage)
        const imagePath = req.file.path
        const response =  await uploadOnCloudinary(imagePath)
        console.log(response.url)
         
    const
        { email } = registerDetails

     await addDetail.findOneAndUpdate( {email: email}  , {$set :{image:response.url}})
     const personalDetails = await addDetail.findOne({email: email})
     console.log(personalDetails)


        res.status(201).json({ message: 'Profile Picture updated successfully!'  , personalDetails});
      }

    }
catch (error) {
    
    console.log("Something Went Wrong : "+ error)
    res.status(400).json({message:"Something Went Wrong :" , error})
    
}

}




//remove Profile Picture API
exports.removeProfilePicture = async(req , res)=>{
    try {
         
        const registerDetails = await User.findById(req.details._id).select("-password")
        const details = await addDetail.findOne({email:registerDetails.email})
        if(!details.image){
            console.log("You can't remove image becuse image is not add yet or removed alreday")
            res.status(300).json({message:"You can't remove image becuse image is not add yet or removed alreday"})
           
        }
        else{
             
            const parts = details.image.split('/');
            const stringAfterLastSlash = parts[parts.length - 1];
            const finalPublicID = stringAfterLastSlash.replace('.jpg', '');
            console.log(finalPublicID); // Output: x9df9nfagsgp2ydtpd7f
       const deletedImage =  await deleteOnCloudnary(finalPublicID)

       console.log(deletedImage+ " I am Here ,  Problem is here ")
      
    const
        { email } = registerDetails

      await addDetail.findOneAndUpdate( {email: email}  , {$set :{image:""}})
      const personalDetails = await addDetail.findOne({email:email})

        res.status(201).json({ message: 'Profile Picture Removed successfully!'  , personalDetails});
      }
    }


catch (error) {
    
    console.log("Something Went Wrong : "+ error)
    res.status(400).json({message:"Something Went Wrong :" , error})
    
}
}




// Credentials 
//export CLOUDINARY_URL=cloudinary://823317268528185:KFufg2IoLMRFBnrDccF0ldJVwa8@doyzrpatw


