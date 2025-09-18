const Profile = require("../models/Profile");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const mongoose = require("mongoose");
const {convertSecondsToDuration} = require("../utils/SecToDuration");

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, about, contactNumber, gender } = req.body;
    const userId = req.user.id;

    const userDetails = await User.findById(userId);

    let profile;
    if (!userDetails.additionalDetails) {
      // Create new profile
      profile = await Profile.create({ dateOfBirth, about, contactNumber, gender });

      // Link profile to user
      userDetails.additionalDetails = profile._id;
      await userDetails.save();
    } else {
      // Update existing profile
      profile = await Profile.findById(userDetails.additionalDetails);
      if (!profile) {
        return res.status(404).json({ success: false, message: "Profile not found" });
      }

      profile.dateOfBirth = dateOfBirth;
      profile.about = about;
      profile.contactNumber = contactNumber;
      profile.gender = gender;
      await profile.save();
    }

    userDetails.firstName = firstName;
    userDetails.lastName = lastName;
    await userDetails.save();

    const updatedUserDetails = await User.findById(userId).populate("additionalDetails").exec();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//deleted account


// Explore :- how can we schedule this deletion operation
exports.deleteAccount = async (req,res) =>{
    try{
        // get id
        const id = req.user.id;
        //validation
         const user = await User.findById({ _id: id });
        if(!user){
            return res.status(404).json({
                success:false,
                message:'User Not Found',
            });
        }
        //delete profile
        await Profile.findByIdAndDelete({_id: new mongoose.Types.ObjectId(user.additionalDetails),});
        //TODO:: HW unenroll user fromall enrolled courses
        //delete user
        for (const courseId of user.courses) {
              await Course.findByIdAndUpdate(
                  courseId,
                 { $pull: { studentsEnroled: id } },
                 { new: true }
              );
         }

        await User.findByIdAndDelete({ _id: id });

        //return response
        return res.status(200).json({
            success:true,
            message:'User Deleted Successfully',
        });
        await CourseProgress.deleteMany({ userId: id });
    }
    catch(error){
      console.log(error)
        res.status(500).json({
            success:false,
            message:'User cannot be deleted',
        });
    }
}


exports.getAllUserDetails = async (req,res) =>{
    try{
        //get id
        const id = req.user.id;
        //validation and get user detail
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        //return response
        return res.status(200).json({
            success:true,
            message:'User data fetched successfully',
            data: userDetails,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
};

 // ????????????????????????????????????????????????????
exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture;
      const userId = req.user.id;
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      console.log(image);
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      );
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id;
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec();
      userDetails = userDetails.toObject();
      var SubsectionLength = 0;
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0;
        SubsectionLength = 0;
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
          ].subSection.reduce(
            (acc, curr) => acc + parseInt(curr.timeDuration),
            0
          );
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          );
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length;
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        });
        courseProgressCount = courseProgressCount?.completedVideos.length;
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100;
        } else {
          const multiplier = Math.pow(10, 2);
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier;
        }
      }
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        });
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  exports.instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find({ instructor: req.user.id });
  
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsEnroled.length;
        const totalAmountGenerated = totalStudentsEnrolled * course.price;
  
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
  
          totalStudentsEnrolled,
          totalAmountGenerated,
        };
  
        return courseDataWithStats;
      });
  
      res.status(200).json({ courses: courseData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };

