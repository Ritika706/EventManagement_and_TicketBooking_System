import express from "express";
import { signup, login, forgotPassword, resetPassword } from "../Controller/authController.js";
import { validateBody } from "../middleware/validate.js";
import {
	authSignupSchema,
	authLoginSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
} from "../validation/schemas.js";

const router = express.Router();

router.post("/signup", validateBody(authSignupSchema), signup);
router.post("/login", validateBody(authLoginSchema), login);
router.post("/forgot-password", validateBody(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateBody(resetPasswordSchema), resetPassword);

export default router;
