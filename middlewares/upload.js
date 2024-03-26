const multer = require("multer")
//storage for uplading file 
const storage = multer.diskStorage({
    destination:(req , file , cb)=>{
        cb(null , '/home/uvesh/Documents/Storage')
    }
},{
    filename: (req , file , cb)=>{
        
        cb(null , file.originalname + Date.now()  )
    }
})


// multer instance

const upload = multer({storage: storage})
module.exports = upload

