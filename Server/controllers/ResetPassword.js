const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//reset Password Token
exports.resetPasswordToken = async (req,res) =>{
    try{
        //get email from req body
    const email = req.body.email;
   // console.log("Ye rha ji aapaka email",email);
    //check user for this email, email validation
    const user = await User.findOne({email:email});
   // console.log("Ye rha ji aapaka user",user);
    if(!user){
        return res.json({
            success:false,
            message: 'Your email is not registered please register',
        });
    }
    //generate token
    const token = crypto.randomUUID();
    //Update User BY ADDING TOKEN AND EXPIRATION TiME
    const updatedDetails = await User.findOneAndUpdate(
        {email: email},
        {
            token:token,
            resetPasswordExpires: Date.now()+ 5*60*1000,
        },
        {new:true}); // new true updated document return karta hai

    //create url
    const url = `http://localhost:3000/update-password/${token}`
    //send mail containing url
    await mailSender(email, "Password Reset Link", `Password Reset Link : ${url}`);
    //return response
    return res.json({
        success:true,
        message:'Email sent Successfully, please check email and change password',
    });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Soomething went wrong  while sending mailand reset",
        });
    }

    
}

//resetPassword

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body
    console.log("token Bhaiya : ",token)

    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      })
    }
    const userDetails = await User.findOne({ token: token })
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      })
    }
    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      })
    }
    const encryptedPassword = await bcrypt.hash(password, 10)
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true }
    )
    res.json({
      success: true,
      message: `Password Reset Successful`,
    })
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    })
  }
}