import { Schema, model } from "mongoose";
const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  complete: {
    type: Boolean,
    default: false,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: [],
    },
  ],
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  creationTime: {
    type: Number,
    default: new Date().getTime(),
  },
});
const Project = model("Project", projectSchema);

export default Project;
