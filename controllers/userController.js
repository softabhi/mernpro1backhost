import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js"
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto';
import { Course } from '../models/Course.js';
import cloudinary from 'cloudinary';
import getDataUri from '../utils/dataUri.js';
// import { Stats } from "fs";
import { Stats } from "../models/Stats.js";
export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const file = req.file;


    if (!name || !email || !password || !file)
        return next(new ErrorHandler("plese fill all field", 400));

    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("user already exists", 409));


    // console.log(file);
    const fileUri = getDataUri(file);
    // console.log(fileUri)

    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: mycloud.public_id,
            url: mycloud.secure_url
        },
    })

    // res.status(200).json({
    //     success: true,
    //     user,
    // });

    sendToken(res, user, "Resgister Successfully", 201);

})






export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;



    if (!email || !password)
        return next(new ErrorHandler("plese fill all field", 400));

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("incorrect email or password", 401));

    const isMatch = await user.comparePassword(password);

    if (!isMatch) return next(new ErrorHandler("incorrect email or password", 401));

    sendToken(res, user, `Welcome back ${user.name}`, 200);

});

export const logout = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
    }).json({
        success: true,
        massage: "logout successfully"
    });
});



export const getMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user,
    });
});



export const changePassword = catchAsyncError(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
        return next(new ErrorHandler("plese fill all field", 400));

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return next(new ErrorHandler("plese enter correct old pass", 400));

    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success: true,
        massage: "Password change successfully",
    });
});




export const updateProfile = catchAsyncError(async (req, res, next) => {

    const { name, email } = req.body;



    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;



    await user.save();

    res.status(200).json({
        success: true,
        massage: "update Profile  successfully",
    });
});


export const updateProfilePicture = catchAsyncError(async (req, res, next) => {

    const file = req.file;
    const user = await User.findById(req.user._id);
    console.log("file");
    const fileUri = getDataUri(file);
    // console.log(fileUri)

    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    console.log("fileee");
    user.avatar = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
    }

    await user.save();

    res.status(200).json({
        success: true,
        massage: "picture update successfully",
    })
});





export const forgetPassword = catchAsyncError(async (req, res, next) => {

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return next(new ErrorHandler("user not found", 400));

    const resetToken = await user.getResetToken();

    await user.save();

    // send token mail

    const url = `${process.env.FRONTED_URL}/resetpassword${resetToken}`;

    const massage = `Click on this to reset your password ${url}. 
    If you are not requested this than please ignore this.`;

    await sendEmail(user.email, "CourseBundler reset password", massage)

    res.status(200).json({
        success: true,
        massage: `Reset link has been sent to ${user.email}`,
    })
});






export const resetPassword = catchAsyncError(async (req, res, next) => {

    const { token } = req.params;

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        },
    });

    if (!user)
        return next(new ErrorHandler("invailid token or has been expired", 401));


    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        massage: "password reset successfully",
    })
});


export const addToPlayList = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.body.id);

    if (!course) return next(new ErrorHandler("invalid course id", 404));

    const itemExit = user.playList.find((item) => {
        if (item.course.toString() === course._id.toString()) return true;
    });

    if (itemExit) return next(new ErrorHandler("item already exist", 409));


    user.playList.push({
        course: course._id,
        poster: course.poster.url,
    });

    await user.save();

    res.status(200).json({
        success: true,
        massage: "course added successfully",
    })
})


export const deleteToPlayList = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.query.id);

    if (!course) return next(new ErrorHandler("invalid course id", 404));

    const newPlayList = user.playList.filter((item) => {
        if (item.course.toString() !== course._id.toString()) return item;
    });

    user.playList = newPlayList;

    await user.save();

    res.status(200).json({
        success: true,
        massage: "course remove successfully",
    });

});


// adimin controlars
export const getAllUsers = catchAsyncError(async (req, res, next) => {

    const users = await User.find({});

    res.status(200).json({
        success: true,
        users,
    });

});


export const updateUserRole = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler("user is not found", 404));

    if (user.role === "user") user.role = "admin";
    else user.role = "user";
    await user.save();
    res.status(200).json({
        success: true,
        massage: "user role updated",
    });

});


export const deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler("user is not found", 404));

    // cancel subscrioption

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    await user.remove();
    res.status(200).json({
        success: true,
        massage: "user has been delete",
    });

});


export const deleteMyProfile = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user._id);
    if (!user) return next(new ErrorHandler("user is not found", 404));

    // cancel subscrioption

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    await user.remove();


    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
    }).json({
        success: true,
        massage: "user has been delete",
    });

});

User.watch().on("change", async () => {
    const stats = await Stats.find({}).sort({ createAt: "desc" }).limit(1);

    const subscription = await User.find({ "subscription.status": "active" });

    stats[0].users = User.countDocuments;
    stats[0].subscription = subscription.length;

    stats[0].createAt = new Date(Date.now);

    await stats[0].save();
});