//HomePage
exports.homePage= async(req , res)=>{
    res.render('homepage')
}
exports.userPage=async (req , res)=>{
    res.render('userPage')

}



//Auth 
exports.register= async(req , res)=>{
    res.render('register')
}
exports.login= async(req , res)=>{
    res.render('login')
}
exports.logout = async(req , res)=>{
    res.render('logout')
}



//CRUD OPERATIONS  
exports.getUserDetails = async (req , res)=>{
    res.render('getUserDetails')
}

exports.addDetails = async (req , res)=>{
    res.render('addDetails')
}

exports.getDetails = async(req , res)=>{
    if(req.cookies.jwtToken){
        res.render('userPage')

    }
    else{
        res.redirect("/register")
    }
    
}
exports.updateDetails= async(req , res)=>{
    res.render('updateDetails')
}

exports.updateEmail = async(req , res)=>{
    res.render('updateEmail')

}
exports.updateUsername = async(req , res)=>{
    res.render('updateUsername')

}
exports.updatePassword = async(req , res)=>{
    res.render('updatePassword')
}

exports.deleteUser= async(req , res)=>{
    res.render('deleteUser')
}


// forgot and reset Password
exports.forgotPassword = async(req , res)=>{
    res.render('forgotPassword')
}

exports.resetPassword = async (req , res)=>{
    res.render('resetPassword')
}