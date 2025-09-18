const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require("mongoose");

//creating Rating
exports.createRating = async (req,res) =>{
    try{
        ///get user Id
        const userId = req.user.id;

        //fetch data from req body
        const {rating, review, courseId} = req.body;

        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
            {
                _id:courseId,
                studentsEnrolled: {$eleMatch: {$eq:userId}},
            }
        );
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:'Students is not enrolled in the course',

            });
        }
        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        });
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"Course is already reviewed by the user",
            });
        }
        //create rating and reviews
        const ratingReview = await RatingAndReview.create({
            rating,review,
            course:courseId,
            user:userId,
        });
        //update course with this rating and reviews
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                {_id:courseId},
                                {
                                    $push:{
                                        ratingAndReviews: ratingReview._id,
                                    }
                                },
                                {new:true} );

                                await updatedCourseDetailsCourseDetails.save();

        console.log(updatedCoureDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review created successfully",
            ratingReview,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// get average rating

exports.getAverageRating = async (req,res) =>{
    try{
        //get course Id
        const courseId = req.body.courseId;
        //calculate average rating
        const result = await RatingAndReviews.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating : {$avg:"$rating"},
                },
            },
        ]);

        //return rating
        if(Result.length >0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })
        }

        //if no rating and reviews exist
        return res.status(200).json({
            success:true,
            message:'Average rating is 0 , no  rating given till now',
            averageRating:0,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//get all ratingandReviews

exports.getAllRating = async (req,res) =>{
    try{
        const allReviews = await RatingAndReview.find({})
                                 .sort({rating:"desc"})
                                 .populate({
                                    path:"user",
                                    select:"firstName lastName email image",
                                 })
                                 .populate({
                                    path:"course",
                                    select:"courseName",
                                   
                                 })
                                 .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}