
const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const Profile = require("../models/Profile")
require("dotenv").config();
const {passwordUpdated} = require("../Mail/Template/PasswordUpdate")


//send otp
//const mailSender = require("../utils/mailSender");
//const otpTemplate = require("../mail/templates/emailVerificationTemplate"); // if you have one

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const result = await OTP.findOne({ otp:otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    //  result = await OTP.findOne({ otp });
    }

    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body",otpBody )
    // ✅ Send OTP via email
    // await mailSender(
    //   email,
    //   "Your OTP for StudyNotion Signup",
    //   `Your OTP is: ${otp}` // or use a template like otpTemplate(email, otp)
    // );
    // console.log(otp);
    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//signup
exports.signUp = async (req,res) =>{
   try{
     //data fetch from the req ki body
     const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp,} = req.body;


    //validate

    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(403).json({
            success:false,
            message:"All fields are required",
        })
    }
    //match password
    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:'password and confirm password value doesnt match please try again',
        });
    }
    //check useralready exist
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:'User is already Registered',
        });
    }
    //find most recent otpstoredfor the user

    const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);
    //validate otp
    if(!recentOtp.length){
        //otp not found
        return res.status(400).json({
            success:false,
            message:"Otp not found",
        })
    }
    else if(otp !== recentOtp[0].otp){
        return res.status(400).json({
            success:false,
            message:"Invalid Otp",
        })
    }
   //Hash Password
   const hashedPassword = await bcrypt.hash(password,10);

   let approved = "";
   approved === "Instructor" ?(approved = false) :(approved = true);
    //entry create in db

    const profileDetail = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about: null,
        contactNumber:null,
    });

    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType: accountType,
        approved: approved,
        AdditionalDetails:profileDetail._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        

    });
    // return res
    return res.status(200).json({
        success:true,
        message:'User is registered Successfully',
        user,
    });
   }
   catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"User Cannot be Registered, please try again",
    });

   }
};


//login
exports.login = async (req,res) =>{
  
    try{
        //get data from req body
        const {email, password} = req.body;
        //validation of data
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required, please try again ",
            });
        }
        // check user exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, please signup first",
            });
        }
        //generate jwt after password matching
        if(await bcrypt.compare(password, user.password)){
            const payload ={
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:'2h',
            });
            user.token = token;
            user.password = undefined;
            //create cookie and send response

            const options ={
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,  // Makes the cookie inaccessible to JavaScript (for security)
                secure:true,
            }
            // This improves security by preventing XSS (Cross-Site Scripting) attacks.

            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'Logged in Successfully',
            });
        }
        else{
            return res.status(401).json({
                success:false,
                message:'Password is Incorrect',
            });
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure, please try again',
        });
    }
}; 


//change password

//todo homework
exports.changePassword = async (req, res) => {
  try {
   // console.log("Hii bro")
    const userDetails = await User.findById(req.user.id);

    const { oldPassword, newPassword } = req.body;

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};