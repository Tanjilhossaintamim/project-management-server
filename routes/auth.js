import { Router } from "express";
import User from "../schemas/authSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verifytoken from "../middlewares/varify/varifyToken.js";

const userRoutes = Router();

// authenication routes it accessable for all
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
    createdAt: new Date().getTime(),
  });
  try {
    await newUser.save();
    res.send({ success: true });
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
  // set cookie an set response
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .send({
      user: { _id, email, firstName, lastName, role, isVarified },
      token,
    });
});
userRoutes.post("/logout", (req, res) => {
  res.clearCookie("token", { maxAge: 0 }).send({ success: true });
});
userRoutes.post("/varifyLogin", verifytoken, async (req, res) => {
  const userId = req.user._id;
  try {
    const result = await User.findById(userId).select(["-password"]);
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

// those routes only accessable for manager

export default userRoutes;
