import mongoose from "mongoose";

const baseUrl = process.env.MONGODB;

export const connectUsingMongoose = async () => {
  try {
    console.log(baseUrl);
    await mongoose.connect(`${baseUrl}`, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("MongoDB connected using mongoose");
  } catch (err) {
    console.log(err);
  }
};
