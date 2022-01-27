import { Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { login, logout, signup } from "../controllers/auth";
import { isLoggedIn } from "../middlewares/auth";

export const router = Router();

// ROUTES
router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));
router.get("/logout", logout);

/**
 * Protecting a route
 *
 * Steps:
 * - use middleware
 * - check for token presence
 * - verify the token
 * - extract info from payload
 * - NEXT
 *
 * Mobile VS Web
 *
 * One web
 * - Just send the token
 * - Send in cookie, httpOnly
 * - In headers
 * - In body
 */
router.get("/dashboard", isLoggedIn, (_, res: Response) => {
  res.status(200).send("Dashboard");
});
