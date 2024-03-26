require("dotenv").config()
const cloudinary = require('cloudinary');
console.log(process.env.cloud_name)
console.log(process.env.api_key)
console.log(process.env.api_secret)
cloudinary.config({
cloud_name: process.env.cloud_name,
api_key: process.env.api_key,
api_secret:  process.env.api_secret
})
 
 

// cloudinary.uploader.upload( `cloudinary://${process.env.api_key}:${process.env.api_secret}@${process.env.cloud_name}`,
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });

//export CLOUDINARY_URL=cloudinary://823317268528185:KFufg2IoLMRFBnrDccF0ldJVwa8@doyzrpatw



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
         
         console.log("Error: "+ error)
    }
}

 