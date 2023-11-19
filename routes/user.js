import { Router } from "express";
import User from "../schemas/authSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import varifyManager from "../middlewares/varify/checkManage.js";

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
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .send({ token });
});

// those routes only accessable for manager
userRoutes.get("/employees", varifyManager, async (req, res) => {
  const limit = req.query?.limit || 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const filter = {
    // this filter will retrive all users exclude manager
    _id: { $ne: req.manager._id },
  };
  const results = await User.find(filter).skip(skip).limit(limit);
  res.send(results);
});
userRoutes.patch("/employees/:id", varifyManager, async (req, res) => {
  const id = req.params.id;

  const filter = {
    _id: id,
  };
  const isVarified = req.body?.isVarified;
  const updatedData = {
    isVarified,
  };
  const results = await User.updateOne(filter, updatedData);
  res.send(results);
});

userRoutes.delete("/employees/:id", varifyManager, async (req, res) => {
  const id = req.params?.id;
  const filter = {
    _id: id,
  };
  try {
    const result = await User.deleteOne(filter);
    res.send(result);
  } catch (error) {
    res.status(204).send(error);
  }
});
// user routes
userRoutes.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const result = await User.findById(_id);
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

export default userRoutes;
