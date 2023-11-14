import { Schema, model } from "mongoose";

const authSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["manager", "employee"],
  },
});

const User = model("User", authSchema);
export default User;
