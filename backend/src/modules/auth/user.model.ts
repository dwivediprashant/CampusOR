import { Schema, model, Document } from "mongoose";

export type UserRole = "user" | "operator" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "operator", "admin"],
      default: "user", //by default role : user
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);
