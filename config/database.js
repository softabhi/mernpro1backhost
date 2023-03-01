import mongoose from "mongoose";

// mongoose.set('strictQuery', false);
mongoose.set('strictQuery', false);

export const connetDB = async ()=>{
   const {connection} = await mongoose.connect(process.env.MONGO_URI);
   console.log(`MongoDB connected with ${connection.host}`);
}