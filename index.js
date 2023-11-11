import cors from "cors";
import "dotenv/config";
import express from "express";
import connectToDatabase from "./config/db.config.js";
const port = process.env.PORT || 3000;

// intialized a exprss app
const app = express();

// default middlewares
app.use(cors());
app.use(express.json());

// database connection
connectToDatabase();


// default error handling middleware

app.use((req, res, next)=>{
  const error = new Error("Resource not found!")
  error.status = 404
  next(error)
})

app.use((error, req, res, next)=>{
  console.log(error);
  if(error.status){
    return res.status(error.status).json({message: error.message})
  }
  res.status(500).json({message: "something went wrong"})
})

// home route
app.get("/", (_req, res, next) => {
  res.status(200).json({message: "Product Management server is Running :)"});
});

// listen app
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
