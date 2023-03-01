import { Course } from "../models/Course.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from 'cloudinary';
// import  ErrorMidilware  from "../middlewares/Error.js";


export const getAllCourses = catchAsyncError(async(req,res,next) =>{
    const keyword  = req.query.keyword || "";
    const category  = req.query.category || "";

    const course = await Course.find({
        title:{
            $regex:keyword,
            $options:"i"
        },
        category:{
            $regex:category,
            $options:"i"
        }
    }).select("-lectures");
        res.status(200).json({
            success: true,
            course, 

    }); 
});


export const createCourses = catchAsyncError(async (req, res, next) => {


    const {title , descri , category , createdBy} = req.body;
    if(!title || !descri || !category || !createdBy) 
    
       return next(new ErrorHandler("please fill", 300));
       console.log("creatingcourse");
    const file = req.file;

    // console.log(file);
    const fileUri = getDataUri(file);
    // console.log(fileUri)

    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    await Course.create({
        title,
        descri,
        category,
        createdBy,
        poster:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url,
        },
    });

        res.status(201).json({
            success:true,
            massage:"course created successfully, now you can add lecture",
    }); 


});


export const getCourseLecture = catchAsyncError(async(req,res,next) =>{
    const course = await Course.findById(req.params.id);
   if(!course)  return next(new ErrorHandler("coures not found",400));

   course.views=+1;
   await course.save();

        res.status(200).json({
            success: true,
            lectures:course.lectures, 
        }); 
});


export const addLecture = catchAsyncError(async(req,res,next) =>{
   const {id} = req.params;
   const {title,description} = req.body;
    // const file = req.file;
    const course = await Course.findById(id);
   if(!course)  return next(new ErrorHandler("coures not found",400));

   const file = req.file;

   // console.log(file);
   const fileUri = getDataUri(file);
   // console.log(fileUri)

   const mycloud = await cloudinary.v2.uploader.upload(fileUri.content,{
    resource_type:"video",
   }); 

  course.lectures.push({
    title,
    description,
    video:{
        public_id:mycloud.public_id,
        url:mycloud.url,
    }
  })

  course.numOfVideos = course.lectures.length;

   await course.save();

        res.status(200).json({
            success: true,
            massage:"lecture added in course", 
        }); 
});


export const deleteCourses = catchAsyncError(async (req, res, next) => {


    const {id} = req.params;
    const course = await Course.findById(id);
   if(!course)  return next(new ErrorHandler("coures not found",400));
   
  

     await cloudinary.v2.uploader.destroy(course.poster.public_id);
   
    for (let index = 0; index < course.lectures.length; index++) {
        const singleLecture = course.lectures[index];
         await cloudinary.v2.uploader.destroy(singleLecture.video.public_id,{
            resource_type:"video",
         });
    }

      await course.remove();

        res.status(201).json({
            success:true,
            massage:"course deleted successfully",
    }); 


});


export const deleteLecture = catchAsyncError(async (req, res, next) => {
    const {courseId, lectureId} = req.query;
    const course = await Course.findById(courseId);

    console.log("till work1")
   if(!course)  return next(new ErrorHandler("coures not found",400));
   
   const lecture = course.lectures.find((item)=>{
    if(item._id.toString() === lectureId.toString()) return item;
  });
   
  console.log("till work")

  await cloudinary.v2.uploader.destroy(lecture.video.public_id,{
    resource_type:"video",
  });

  console.log("till work2")
   course.lectures = course.lectures.filter((item)=>{
     if(item._id.toString() !== lectureId.toString()) return item;
   });
  
   course.numOfVideos = course.lectures.length;
       await course.save();

        res.status(201).json({
            success:true,
            massage:"lecture deleted successfully",
    }); 


});

// export const createCourses = async (req ,res)=>{
   
//     const singleCourse = new Course({
//         title:req.body.title,
//         descri:req.body.descri,
//         category:req.body.category,
//         createdBy:req.body.createdBy
//     });

//     try{
//         const saveProd = await singleCourse.save();
//         res.send(saveProd);
//     }catch(error){
//         res.status(400).send(error);
//     }


//     // const {title , description , category , createdBy} = req.body;
            
//     // try{
//     //     singleCourse.save();
//     //     ({
//     //         title,
//     //         description,
//     //         category,
//     //         createdBy,
//     //         poster: {
//     //             public_id: "temp",
//     //             url: "temp",
//     //         },
//     //     });
            
//     //                 res.status(201).json({
//     //                     success:true,
//     //                     massage:"course created successfully, now you can add lecture",
//     //             }); 
//     // }catch{
//     //   res.send("something went wrong");
//     // }

// };









// export const createCourses =  catchAsyncError(async (req, res, next) => {

 
//     const {title , description , category , createdBy} = req.body;
//     // if(!title || !description || !category || !createdBy) 
//     //    return next(new ErrorHandler("please fill all fields", 400));

//     // const file = req.file;

//     await Course.create({
//         title,
//         description,
//         category,
//         createdBy,
//         poster:{
//             public_id:"temp",
//             url:"temp",
//         },
//     });

//         res.status(201).json({
//             success:true,
//             massage:"course created successfully, now you can add lecture",
//     }); 


// });

     
//  try {
//     const course = await Course.find();
//     res.status(200).json({
//         success: true,
//         course,
//     }); 
//  } catch (error) {
    
//  }
    // res.send("working");

