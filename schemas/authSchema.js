import { Schema, model } from "mongoose";

const authSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    minlength: [4, "Must be 4 character !"],
  },
  lastName: {
    type: String,
    required: true,
    minlength: [4, "Must be 4 character !"],
  },
  role: {
    type: String,
    required: true,
    enum: ["manager", "employee"],
  },
  isVarified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Number,
  },
});

const User = model("User", authSchema);
export default User;
