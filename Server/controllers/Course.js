const Course = require("../models/Course");
const Category = require("../models/category");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress");
const {convertSecondsToDuration} = require("../utils/SecToDuration");

//createCourse handler function
exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id;

    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body;

    const thumbnail = req.files.thumbnailImage;

    const tag = JSON.parse(_tag);
    const instructions = JSON.parse(_instructions);

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }

    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    });

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

exports.editCourse = async (req, res) => {
    try {
        //destructur to extract courseId
      const { courseId } = req.body;
      //assigning the req.body to a variable update it holds all the new values the course been updated
      const updates = req.body;
      //finding course document using courseId
      const course = await Course.findById(courseId);

      //validation
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
  
      if (req.files) {
        console.log("thumbnail update");
        // retrives the thumbnail
        const thumbnail = req.files.thumbnailImage;
        //upload the thumbnail image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        );
        // update course.thumbnail
        course.thumbnail = thumbnailImage.secure_url;
      }

      //for...in loop
  
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {   // hasOwnProperty check ensures that only properties directly belonging to updates are processed
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key]);
          } else {
            course[key] = updates[key];
          }
        }
      }
  
      await course.save(); // saves the updated course document back to the database
  
      // find most recent course
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec();
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };


//get all courses handler function

exports.getAllCourses = async (req, res) => {
    try {
      const allCourses = await Course.find(
        { status: "Published" },
        {
          courseName: true,
          price: true,
          thumbnail: true,
          instructor: true,
          ratingAndReviews: true,
          studentsEnrolled: true,
        }
      )
        .populate("instructor")
        .exec();
  
      return res.status(200).json({
        success: true,
        data: allCourses,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        success: false,
        message: `Can't Fetch Course Data`,
        error: error.message,
      });
    }
  };

//get course details
exports.getCourseDetails = async (req,res) =>{
    try{
        //get id
        const {courseId} = req.body;
        // find course details
        const courseDetails = await Course.findOne(
                                       {_id:courseId})
                                       .populate(
                                        {
                                            path:"instructor",
                                            populate:{
                                                path:"additionalDetails",
                                            },
                                        }
                                       )
                                       .populate("category")
                                       .populate("ratingAndreviews")
                                       .populate({
                                        path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                                select: "_videoUrl",
                                            },
                                       })
                                       .exec();
       //validation
       if(!courseDetails){
        return res.status(400).json({
            success:false,
            message:`Couldn't fin the course with ${courseId}`
        });
       }

       let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);


       //return response
       return res.status(200).json({
            success:true,
            data: {
                courseDetails,
                totalDuration,
            },
       });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

//get full course detail

exports.getFullCourseDetails = async (req, res) => {
    try {
        // extracting courseId and userId
      const { courseId } = req.body;
      const userId = req.user.id;

      // fetching course Details
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec();

        //fetching user Progress
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      });
  
      console.log("courseProgressCount : ", courseProgressCount);
  
      //handling missing course

      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        });
      }

      //calculating total timme
  
      let totalDurationInSeconds = 0;
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration);
          totalDurationInSeconds += timeDurationInSeconds;
        });
      });
  
      // converting total duration

      const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
  
      // returning data
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      });
    }
     catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.getInstructorCourses = async (req, res) => {
    try {
      const instructorId = req.user.id;
  
      const instructorCourses = await Course.find({
        instructor: instructorId,
      })
        .sort({ createdAt: -1 })
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec();
  
      res.status(200).json({
        success: true,
        data: instructorCourses,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      });
    }
  };
  
exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body;
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      const studentsEnrolled = course.studentsEnroled;
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        });
      }
  
      const courseSections = course.courseContent;
      for (const sectionId of courseSections) {
        const section = await Section.findById(sectionId);
        if (section) {
          const subSections = section.subSection;
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId);
          }
        }
  
        await Section.findByIdAndDelete(sectionId);
      }
  
      await Course.findByIdAndDelete(courseId);
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };