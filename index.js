import cors from "cors";
import "dotenv/config";
import express from "express";
import connectToDatabase from "./config/db.config.js";
import defaultError from "./middlewares/error/defaultError.js";
import admin from "./routes/admin.js";
import userRoutes from "./routes/user.js";
const port = process.env.PORT || 3000;

// intialized a exprss app
const app = express();

// default middlewares
app.use(cors());
app.use(express.json());

// database connection
connectToDatabase();

// admin route
app.use("/admin", admin);

// auth route
app.use("/auth", userRoutes);

// default error handling middleware
app.use(defaultError);

// app.use()

// home route
app.get("/", (_req, res, next) => {
  res.status(200).json({ message: "Product Management server is Running :)" });
});

// listen app
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
