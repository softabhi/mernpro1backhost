import mongoose from "mongoose";
// import validator from "validator";
// mongoose.set('strictQuery', true);



const schema = new mongoose.Schema({
    // title:{
    //     type:String,
    // },
    // category:{
    //     type:String,
    // }



    title: {
        type: String,
        required: [true, "Plese enter course title"],
        minLength: [5, "title must be in 4 charactor"],
        maxLength: [80, "title must be in 80 charactor"],
    },
    descri: {
        type: String,
        required: [true, "Plese enter course description"],
        minLength: [4, "title must be in 4 charactor"],

    },
     lectures: [
        {
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            video: {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        },
    ],
    poster: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    views: {
        type: Number,
        default: 0,
    },
    numOfVideos: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: [true, "pleae enter editor name"],
    },
    createAt: {
        type: Date,
        default: Date.now,
    },

});



// const schema = new mongoose.Schema({

//     title: {
//         type: String,
//         required: [true, "Plese enter course title"],
//         minLength: [5, "title must be in 4 charactor"],
//         maxLength: [80, "title must be in 80 charactor"],
//     },
//     description: {
//         type: String,
//         required: [true, "Plese enter course title"],
//         minLength: [4, "title must be in 4 charactor"],

//     },
//     // lectures: [
//     //     {
//     //         title: {
//     //             type: String,
//     //             required: true,
//     //         },
//     //         description: {
//     //             type: String,
//     //             required: true,
//     //         },
//     //         video: {
//     //             public_id: {
//     //                 type: String,
//     //                 required: true,
//     //             },
//     //             url: {
//     //                 type: String,
//     //                 required: true,
//     //             },
//     //         },
//     //     },
//     // ],
//     poster: {
//         public_id: {
//             type: String,
//             required: true,
//         },
//         url: {
//             type: String,
//             required: true,
//         },
//     },
//     views: {
//         type: Number,
//         default: 0,
//     },
//     numOfVideos: {
//         type: Number,
//         default: 0,
//     },
//     category: {
//         type: String,
//         required: true,
//     },
//     createdBy: {
//         type: String,
//         required: [true, "pleae enter editor name"],
//     },
//     createAt: {
//         type: Date,
//         default: Date.now,
//     },

// });

export const Course = mongoose.model("Course", schema);