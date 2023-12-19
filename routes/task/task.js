import express from "express";
import verifyManager from "../../middlewares/verify/verify.js";
import Task from "../../schemas/task/taskSchema.js";

const taskRouter = express.Router();

taskRouter.post("/tasks", verifyManager, async (req, res) => {
  try {
    const body = req.body;
    let newTask = new Task({
      ...body,
      createdBy: req.manager?._id,
    });
    newTask = await newTask.save();
    res.send(newTask);
  } catch (error) {
    res.status(500).send(error);
  }
});

taskRouter.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

taskRouter.get("/tasks/:id", verifyManager, async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.id });
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

taskRouter.patch("/assignTask/:id", verifyManager, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

taskRouter.delete("/deleteTask/:id", verifyManager, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
export default taskRouter;
