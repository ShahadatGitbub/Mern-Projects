import express from "express";
import userAuthentication from "../middlewares/userAuth.js";
import { getUserDetails } from "../controllers/user.controller.js";

const userRouter = express.Router();


userRouter.get('/user-details',userAuthentication,getUserDetails);


export default userRouter;