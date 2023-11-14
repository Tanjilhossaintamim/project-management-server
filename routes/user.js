import { Router } from "express";
import User from "../schemas/authSchema.js";
import bcrypt from "bcrypt";

const userRoutes = Router();

userRoutes.post("/register", async (req, res) => {
  const userData = req.body;
  // check email and password 
  if (!userData?.email || !userData?.password) {
    return res
      .status(400)
      .send({ message: "email and password are required !" });
  }
  const isExisting = await User.findOne({ email: userData?.email });
  // check user already existes or not
  if (isExisting) {
    return res.status(400).send({ message: "email already exists !" });
  }
  // hash user password
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  // create new user
  const newUser = new User({
    email: userData.email,
    password: hashedPassword,
    role: "employee",
  });
  await newUser.save();

  res.send({ success: true });
});

export default userRoutes;
