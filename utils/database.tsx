// import mongoose from "mongoose";

// let isConnected = false;

// export const connectToDB = async () => {
//   mongoose.set("strictQuery", true);

//   if (isConnected) {
//     console.log("Mongo is already connected");
//     return;
//   }

//   try {
//     await mongoose.connect("mongodb://localhost:27017/NextLogintut");

//     isConnected = true;
//     console.log("connected to mongodb");
//   } catch (e) {
//     console.log(e);
//   }
// };




// const mongoose = require("mongoose");
// mongoose
//   .connect("mongodb://0.0.0.0:27017/react-login-tut")
//   .then(() => {
//     console.log("mongodb connected");
//   })
//   .catch(() => {
//     console.log("failed");
//   });

// const newSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });

// const collection = mongoose.model("collection", newSchema);

// module.exports = collection;
