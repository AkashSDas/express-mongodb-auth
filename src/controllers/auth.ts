import { Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Create a user
 *
 * Steps:
 * - get all information
 * - check mandatory fields
 * - already registered
 * - Take care of password
 * - generate token (for direclty loggin in the user) or send success msg
 */
export const signup = async (req: Request, res: Response) => {
  const { firstname, lastname, email, password } = req.body;

  // Validation check
  if (!(firstname && lastname && email && password)) {
    res.status(400).json({ error: true, msg: "All fields are required" });
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(401).json({ error: true, msg: "User already exists" });
  }

  // Hashing password
  const encryptPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    firstname,
    lastname,
    email: email.toLowerCase(),
    passwordDigest: encryptPassword,
  });

  // Create login token
  const token = jwt.sign(
    { user_id: user._id, email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "2h" }
  );

  // Add login token to user (not updating in db for now)
  user.rememberToken = token; // Saving this is optional (saving it not of much use, so it can be ommited)

  res
    .status(200)
    .json({ error: false, msg: "Successfully created account", user });
};

/**
 * Loggin the user
 *
 * Steps:
 * - get all information
 * - check mandatory fields
 * - get user from database
 * - compare and verify password
 * - give token or other information to the user
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!(email && password)) res.status(400).send("Field is missing");
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.passwordDigest))) {
    const token = jwt.sign(
      { user_id: user.id, email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" }
    );

    user.passwordDigest = undefined;
    user.rememberToken = token;
    // res.status(200).json(user); // for sending token directly

    // Sending cookie
    const options = {
      expires: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000 // 3d
      ),
      httpOnly: true, // cookie can be only read by backend (also Postman)
    };
    res.status(200).cookie("token", token, options).json(user);
  }
  res.status(400).send("User does not exists");
};

/**
 * Logout user
 */
export const logout = (_: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).send("Successfully logged out");
};
