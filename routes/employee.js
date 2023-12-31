import verifyManager from "../middlewares/verify/verify.js";
import User from "../schemas/authSchema.js";
import { Router } from "express";
const employeeRouter = Router();

employeeRouter.get("/", verifyManager, async (req, res) => {
  const filter = {};
  const limit = req.query?.limit || 8;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;
  const verified = req.query?.verified;
  const role = req.query?.role;
  const name = req.query?.name;

  if (verified) {
    filter.isVerified = verified;
  }
  if (role) {
    filter.role = role;
  }
  if (name) {
    filter.firstName = { $regex: name, $options: "i" };
  }
  const count = await User.countDocuments(filter);
  const results = await User.find(filter)
    .select(["-password"])
    .sort({ firstName: req.query?.sort || "asc" })
    .skip(skip)
    .limit(limit);
  const response = {
    count: count,
    users: results,
  };

  res.send(response);
});
employeeRouter.patch("/:id", verifyManager, async (req, res) => {
  const id = req.params.id;

  const filter = {
    _id: id,
  };

  const updatedData = {
    ...req.body,
  };
  try {
    const results = await User.updateOne(filter, updatedData);
    res.send(results);
  } catch (error) {
    res.send(error);
  }
});

employeeRouter.delete("/:id", verifyManager, async (req, res) => {
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
employeeRouter.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const result = await User.findById(_id).select(["-password"]);
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

export default employeeRouter;
