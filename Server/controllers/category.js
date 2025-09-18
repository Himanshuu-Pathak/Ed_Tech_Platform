
//const category = require("../models/category");
const Category = require("../models/category");

function getRandomInt(max){
    return Math.floor(Math.random()*max);
}

//create tag ka handler function

exports.createCategory = async (req,res) =>{
    try{
        //fetch data
        const {name, description} = req.body;
        //validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //create entry in DB
            const  categoryDetails = await Category.create({
                name:name,
                description:description,     
            });
            console.log(categoryDetails);
            //return response

            return res.status(200).json({
                success:true,
                message:"Category created Successfully",
            })
                
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

//getAllTag handler function

exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find().populate({path: "courses",
      select: "courseName status",});
    const categoriesWithPublishedCourses = allCategories.filter((category) => {
      // Defensive check: ensure courses is an array
      if (!Array.isArray(category.courses)) return false;

      return category.courses.some(
        (course) => course && course.status === "Published"
      );
    });
    console.log("All categories:", JSON.stringify(allCategories, null, 2));

    res.status(200).json({
      success: true,
      //data: categoriesWithPublishedCourses,
      data: allCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,    });
  }
};

// category page details

exports.categoryPageDetails = async (req,res) =>{
    try{
        //get category Id
        
        const {categoryId} = req.body;
        console.log("categoryId hai bhaiya",categoryId)
        //get courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId).populate({path:"courses", match: {status: "Published"}, populate: "ratingAndReview",}).exec();
        //validation
        if(!selectedCategory){
            console.log("Category not found ,");
            return res.status(404).json({
                success:false,
                message:'Data Not Found',
            });
        }

        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.");
            return res.status(200).json({
              success: true,
              message: "No courses found for the selected category.",
            });
          }

          const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
          });

        //get courses for different category
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
              ._id
          )
            .populate({
              path: "courses",
              match: { status: "Published" },
            })
            .exec();
          console.log("differentCategory : ",differentCategory);

          const allCategories = await Category.find()
         .populate({
          path: "courses",
          match: { status: "Published" },
          })
         .exec();
         const allCourses = allCategories.flatMap((category) => category.courses);
          const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10);

        //get top selling courses
        //return response 
        res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};