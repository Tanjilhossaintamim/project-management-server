import express from "express";
import "dotenv/config";
import cors from "cors";
import connectToDatabase from "./src/dbconfigure/config.js";
const port = process.env.PORT || 3000;

// intialized a exprss app
const app = express();

// default middlewares
app.use(cors());
app.use(express.json());

// database connection
connectToDatabase();

// home route
app.get("/", (req, res) => {
  res.send("Product Management server is Running :)");
});

// listen app
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
