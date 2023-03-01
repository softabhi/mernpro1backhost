import express from 'express'
import {
    addToPlayList,
    changePassword,
    deleteMyProfile,
    deleteToPlayList,
    deleteUser,
    forgetPassword,
    getAllUsers,
    getMyProfile,
    login, logout,
    register, resetPassword,
    updateProfile,
    updateProfilePicture,
    updateUserRole
} from '../controllers/userController.js';
import { authorizedAdmin, isAuthenticated } from '../middlewares/auth.js';
import singleUpload from '../middlewares/multer.js';


const router = express.Router();


// to register new user
router.route("/register").post(singleUpload, register);
// login 
router.route("/login").post(login);
// for logout
router.route("/logout").get(logout);
//for get profile
router.route("/me").get(isAuthenticated, getMyProfile);

router.route("/me").delete(isAuthenticated, deleteMyProfile);

router.route("/changepassword").put(isAuthenticated, changePassword);

router.route("/updateprofile").put(isAuthenticated, updateProfile);


router.route("/updateprofilepicture").put(isAuthenticated,singleUpload,updateProfilePicture);

router.route("/forgetpassword").post(forgetPassword);

router.route("/resetpassword/:token").put(resetPassword);

router.route("/addtoplaylist").post(isAuthenticated,addToPlayList);

router.route("/deletetoplaylist").delete(isAuthenticated,deleteToPlayList);

// admin routes
router.route("/admin/users").get(isAuthenticated,authorizedAdmin,getAllUsers)
router.route("/admin/user/:id").put(isAuthenticated,authorizedAdmin,updateUserRole).
delete(isAuthenticated,authorizedAdmin,deleteUser);


export default router;