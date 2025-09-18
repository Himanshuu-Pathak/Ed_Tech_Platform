const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,  
        required:true,
        ref:"User", /// changed
    },
    whatYouWillLearn:{
        type: String,
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        },
    ],
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",
        },
    ],
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    tag:{
        type:[String],
        required: true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"category",  // changed
    },
    studentsEnroled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User",  // changed
        },
    ],
    instructions:{
        type: [String],
    },
    status: {
        type: String,
        enum: ["Draft", "Published"],
        default: "Draft",
    },
    createdAt:{type:Date, default:Date.now},
});

module.exports = mongoose.model("Course",courseSchema);