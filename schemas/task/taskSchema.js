import { Schema, model } from "mongoose";

const taskSchema = new Schema({
  taskTitle: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
  },
  taskNote: {
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
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
<<<<<<< HEAD
  assignUser: {
    type: String,
=======
  assignTask: {
    type: Schema.Types.ObjectId,
    ref: "User",
>>>>>>> d77ae39186dbf98061a3b20a501bbe6fabe8c81a
  },
  deadLine: {
    type: String,
  },
});

const Task = model("Task", taskSchema);
export default Task;
