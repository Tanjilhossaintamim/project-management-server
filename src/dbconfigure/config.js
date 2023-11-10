import mongoose from "mongoose";

const connectToDatabase = () => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kkcmbk1.mongodb.net/projectManagement?retryWrites=true`
    )
    .then(() => console.log("database connected successfully !"))
    .catch(() => console.log("database connection failed !"));
};

export default connectToDatabase;
