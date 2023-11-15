import { Router } from "express";
import User from "../schemas/authSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRoutes = Router();

userRoutes.post("/register", async (req, res) => {
  const userData = req.body;
  // check email and password
  if (
    !userData?.email ||
    !userData?.password ||
    !userData?.firstName ||
    !userData?.lastName
  ) {
    return res
      .status(400)
      .send({ message: "please provide all required filed !" });
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
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: "employee",
    isVarified: false,
  });
  try {
    await newUser.save();
    res.send({ message: "Registerd Successfully" });
  } catch (error) {
    res.send(error);
  }
});

userRoutes.post("/login", async (req, res) => {
  const userData = req.body;
  // check user provide all required data
  if (!userData?.email || !userData?.password) {
    return res
      .status(400)
      .send({ message: "please provide email and password !" });
  }
  const { email, password } = userData;
  const isUserExists = await User.findOne({ email });
  // check email already exists or not
  if (!isUserExists) {
    return res.status(401).send({ message: "invalid email or password !" });
  }
  // compare plain text password and hash password
  const isPasswordMatched = await bcrypt.compare(
    password,
    isUserExists.password
  );
  if (!isPasswordMatched) {
    return res.send({ message: "password does not matched !" });
  }
  const { firstName, lastName, role, _id, isVarified } = isUserExists;
  // genarate a jwt token for user
  const token = jwt.sign(
    { email, firstName, lastName, role, isVarified, _id },
    process.env.SECRET_KEY,
    { expiresIn: "72h" }
  );
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .send({ token });
});

export default userRoutes;
