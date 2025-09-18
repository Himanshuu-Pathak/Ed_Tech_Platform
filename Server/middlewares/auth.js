const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");


dotenv.config();

// auth
exports.auth = async (req,res,next) =>{
    try{
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ","");
        // if token missing the return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token is missing',
            });
        }

        //verify the token
        try{
           const decoded =  jwt.verify(token, process.env.JWT_SECRET);
           console.log(decoded);
            req.user = decoded;

        }
        catch(err){
             //verification issue
             return res.status(401).json({
                success:false,
                message: 'token is invalid',
            });
        }
        next(); // helps us to go to the next middleware
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while verifying the tokend',
        });
    }
}



exports.isStudent = async (req,res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });
        if(userDetails.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message:'This is a protected route for student only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified please try again'
        })
    }
}


//isInstructor

exports.isInstructor = async (req,res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });
        if(userDetails.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message:'This is a protected route for instructor only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified please try again'
        })
    }
}


// isAdmin
exports.isAdmin = async (req,res, next) => {
    try {
        const userDetails = await User.findOne({ email: req.user.email });
        if(userDetails.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message:'This is a protected route for admin only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified please try again'
        })
    }
}
