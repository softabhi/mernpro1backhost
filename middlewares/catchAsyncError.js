export const catchAsyncError = (passedFunction) => (req , res ,next) => {

    // console.log(passedFunction);
    // console.log("passedFunction");
 Promise.resolve(passedFunction(req,res,next)).catch(next);
};