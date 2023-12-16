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
  compleate: {
    type: Boolean,
    default: false,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  creationTime: {
    type: Date,
    default: Date.now,
  },
});
const Project = model("Project", projectSchema);
export default Project;
