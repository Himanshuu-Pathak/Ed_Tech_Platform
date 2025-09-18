

const mongoose = require("mongoose");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");

exports.updateCourseProgress = async (req, res) => {
    //fetch courseId and SubSectionId 
  const { courseId, subsectionId } = req.body;
  // extracting userId from user Object
  const userId = req.user.id;

  try {
    // finding correspoinding subsection
    const subsection = await SubSection.findById(subsectionId);
    //handling missing subsection
    if (!subsection) {
      return res.status(404).json({
        error: "Invalid subsection",
      });
    }
    // checking for the existing user progress
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });
    // Handling missing course progress:


    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress Does Not Exist",
      });
    }
    
     else {
        // checking for the subsection is already completed
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res.status(400).json({
          error: "Subsection already completed",
        });
      }
      // marking the subsection as completed
      courseProgress.completedVideos.push(subsectionId);
    }
    // save updated course progeress
    await courseProgress.save();
    return res.status(200).json({
      message: "Course progress updated",
    });
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};