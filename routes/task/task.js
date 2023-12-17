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
export default taskRouter;
