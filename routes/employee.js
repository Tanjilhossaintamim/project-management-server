import varifyManager from "../middlewares/varify/checkManage.js";
import User from "../schemas/authSchema.js";
import { Router } from "express";
const employeeRouter = Router();

employeeRouter.get("/", varifyManager, async (req, res) => {
  const limit = req.query?.limit || 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const filter = {
    // this filter will retrive all users exclude manager
    _id: { $ne: req.manager._id },
  };
  const results = await User.find(filter)
    .select(["-password"])
    .skip(skip)
    .limit(limit);
  res.send(results);
});
employeeRouter.patch("/:id", varifyManager, async (req, res) => {
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

employeeRouter.delete("/:id", varifyManager, async (req, res) => {
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
