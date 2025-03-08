import express from "express";
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerificationOtp, verifyEmailByOTP } from "../controllers/auth.controller.js";
import userAuthentication from "../middlewares/userAuth.js";

const authRouter = express.Router();

// Define authentication routes
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/send-verify-otp",userAuthentication, sendVerificationOtp); //userAuthentication is a middleware
authRouter.post("/verify-account",userAuthentication,verifyEmailByOTP);
authRouter.get("/is-auth",userAuthentication,isAuthenticated);

authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
