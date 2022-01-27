import { Document, model, Schema } from "mongoose";

type UserDocument = Document & {
  firstname: string;
  lastname: string;
  email: string;
  passwordDigest: string;
  rememberToken: string;
};

const UserSchema = new Schema<UserDocument>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  passwordDigest: { type: String, required: true },
  rememberToken: { type: String },
});

export const User = model("User", UserSchema);
