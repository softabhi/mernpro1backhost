
// class ErrorHandler extends Error {
//     constructor(massage,statusCode){
//         super(massage);
//         this.statusCode = statusCode;
//     }
// }
// export default ErrorHandler;

class ErrorHandler extends Error {
    constructor(massage, statusCode){
        super(massage);
        // this.massage = massage;
        this.statusCode = statusCode;
        
        console.log(massage);
    }
}

export default ErrorHandler;