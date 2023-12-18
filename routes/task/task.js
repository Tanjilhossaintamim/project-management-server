import express from "express";
import Task from "../../schemas/task/taskSchema.js";

const taskRouter = express.Router();

// console.log(Task);

taskRouter.post("/tasks", async (req, res) => {
  try {
    const body = req.body;
    let newTask = new Task(body);
    newTask = await newTask.save();
    res.send(newTask);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

taskRouter.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

taskRouter.get("/tasks/:id", async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.id });
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

taskRouter.patch("/assignTask/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

taskRouter.delete("/deleteTask/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
export default taskRouter;
