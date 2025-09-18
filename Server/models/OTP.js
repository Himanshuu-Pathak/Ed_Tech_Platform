const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../Mail/Template/EmailVerification");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type: Date,
        default:Date.now,
        expires: 60*5,
    },
});

// a function to send email
async function sendVerificationEmail(email, otp){
    try{
        const mailResponse = await mailSender(email, "verification Email from StudyNotion",emailTemplate(otp));
        console.log("Email sent Successfully :", mailResponse);
    }
    catch(error){
        console.log("error occured while sending mails :",error);
        throw error;
    }
}
OTPSchema.pre("save", async function(next){
   if(this.isNew){                             // ??
    await sendVerificationEmail(this.email, this.otp);
   }
    next(); // next middle ware pe le jayega
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;