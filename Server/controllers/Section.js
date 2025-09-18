const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req,res) =>{
    try{
        //data fetch
        console.log("section data : ",req);
        const {sectionName, courseId} = req.body;
        ////data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }

        // create section
        const newSection = await Section.create({sectionName});
        //Update course with section object id
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                                  courseId,
                                                  {
                                                    $push:{
                                                        courseContent:newSection._id,
                                                    }
                                                  },
                                                  {new:true},
                                               )
                                               .populate({
                                                path: "courseContent",
                                                populate: {
                                                  path: "subSection",
                                                },
                                              })
                                              .exec();
        // use populte to replace section and subsection in both the updated CourseDetail
        //return response
        return res.status(200).json({
            success:true,
            message:'Section Created Successfully',
            updatedCourseDetails,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create section, please try again",
            error:error.message,
        });

    }
}


//update section

exports.updateSection = async (req,res) =>{
    try{
        //data input
        
        const {sectionName,sectionId ,courseId} = req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:'Missing Properties'
            });
        }
        //uppdate data
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName}, {new:true});
        const course = await Course.findById(courseId).populate({ path: "courseContent",populate: { path: "subSection",}, }).exec();
        //return response
        return res.status(200).json({
            success:true,
            message:'Section Updated Successfully',
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update the section , please try again",
            error:error.message,
        });
    }
};


/// ???????????????????????///////////////
//delete section
exports.deleteSection = async (req,res)=>{
    try{
        //get id -> assuming that we are sending id in params
        const {sectionId} = req.params
        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        // return response
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete section please try again",
            error:error.message,
        })
    }
}