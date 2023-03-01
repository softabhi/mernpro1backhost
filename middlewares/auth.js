import  Jwt  from "jsonwebtoken";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";


export const isAuthenticated = catchAsyncError(async (req,res,next) =>{
    const {token} =req.cookies;

    if(!token) return next(new ErrorHandler("not logged in",401));

    const decode = Jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decode._id);

    next();
})


export const authorizedAdmin = (req,res,next) => {
    if(req.user.role !== "admin")
    return next(
        new ErrorHandler(
            `${req.user.role} is not allow to access this resource`,
            403
        )
    );
    next();
};
