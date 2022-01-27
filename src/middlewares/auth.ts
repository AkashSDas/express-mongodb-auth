import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * When using mobile app use token on header, using cookie is a bad idea
 */

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.token ||
    req.body?.token ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) res.status(403).send("Token is missing");

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    console.log(err);
  }

  next();
};
