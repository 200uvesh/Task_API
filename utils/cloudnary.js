//Cloudnary Logic  :-

require("dotenv").config()
const cloudinary = require('cloudinary');
cloudinary.config({
cloud_name: process.env.cloud_name,
api_key: process.env.api_key,
api_secret:  process.env.api_secret
})
 
 
// upload file on cloudnary
exports.uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        return response;

    } catch (error) {
         
         console.log("Something went Wrong : "+ error)
    }
}


// for delete file  from cloudnary 
exports.deleteOnCloudnary = async (localFilePath)=>{
    try {
        console.log(localFilePath)
         cloudinary.uploader.destroy(localFilePath, (error , result)=>{
            if(error){
                console.log("Error h yha pr :" , error)
            }
            else{
            console.log(result)
            }
         });
       
        
    } catch (error) {
        console.log("Something went wrong on deleting image  :"  , error)
        
    }

     
}

 
 
// cloudinary.uploader.upload( `cloudinary://${process.env.api_key}:${process.env.api_secret}@${process.env.cloud_name}`,
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });

//export CLOUDINARY_URL=cloudinary://823317268528185:KFufg2IoLMRFBnrDccF0ldJVwa8@doyzrpatw

