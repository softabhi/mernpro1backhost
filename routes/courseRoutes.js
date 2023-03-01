import express from 'express'
import { addLecture, createCourses, deleteCourses, deleteLecture, getAllCourses, getCourseLecture } from '../controllers/courseController.js';
import { authorizedAdmin, isAuthenticated } from '../middlewares/auth.js';
import singleUpload from '../middlewares/multer.js';

const router = express.Router();
 

// get all courses without lectures 
router.route("/courses").get(getAllCourses);

// create coures by only admin
router.route("/createcourses").post(isAuthenticated ,authorizedAdmin, singleUpload, createCourses);

router.route("/course/:id").get(isAuthenticated,getCourseLecture)
.post(isAuthenticated,authorizedAdmin,singleUpload, addLecture)
.delete(isAuthenticated,authorizedAdmin,deleteCourses);

router.route("/lecture").delete(isAuthenticated ,authorizedAdmin, deleteLecture);


export default router;