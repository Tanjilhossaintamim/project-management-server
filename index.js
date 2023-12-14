import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import connectToDatabase from "./config/db.config.js";
import defaultError from "./middlewares/error/defaultError.js";
import admin from "./routes/admin.js";
import userRoutes from "./routes/auth.js";
import employeeRouter from "./routes/employee.js";
const port = process.env.PORT || 3000;

// intialized a exprss app
const app = express();
const server = createServer(app);
// create socket connection
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://project-management-psi-ochre.vercel.app",
    ],
  },
});

// default middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// database connection
connectToDatabase();

// admin route
app.use("/admin", admin);

// auth route
app.use("/auth", userRoutes);
// employee router
app.use("/employee", employeeRouter);

// default error handling middleware
app.use(defaultError);

// app.use()

// home route
app.get("/", (_req, res, next) => {
  io.emit("init", {
    data: "success",
  });
  res.status(200).json({ message: "Product Management server is Running :)" });
});

// listen app
server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
