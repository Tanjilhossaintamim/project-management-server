import { Schema, model } from "mongoose";

const taskSchema = new Schema({
  taskTitle: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
  },
  taskNode: {
    type: String,
  },
  completed: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  deadLine: {
    type: String,
  },
});

const Task = model("Task", taskSchema);
export default Task;
