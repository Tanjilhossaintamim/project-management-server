import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import connectToDatabase from "./config/db.config.js";
import defaultError from "./middlewares/error/defaultError.js";
import admin from "./routes/admin.js";
import userRoutes from "./routes/auth.js";
import employeeRouter from "./routes/employee.js";
import projectRouter from "./routes/project.js";
import createHttpError from "http-errors";
const port = process.env.PORT || 3000;

// intialized a exprss app
const app = express();
const server = createServer(app);
// create socket connection
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://projectmanagementnaim.netlify.app",
    ],
  },
});

// default middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://projectmanagementnaim.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));

// database connection
connectToDatabase();

// admin route
app.use("/admin", admin);

// auth route
app.use("/auth", userRoutes);
// employee router
app.use("/employee", employeeRouter);
// project router
app.use("/projects", projectRouter);

// app.use()

// home route
app.get("/", (_req, res, next) => {
  io.emit("init", {
    data: "success",
  });
  res.status(200).json({ message: "Product Management server is Running :)" });
});

app.use((req, res, next) => {
  next(createHttpError(404, "Route Not found !"));
});
// default error handling middleware
app.use(defaultError);
// listen app
server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
