import { Router, type Request, type Response } from "express";
import { getGalery, getNotice, getStaff } from "../controller/userController";

const userRouter = Router();

userRouter.get("/staffs", getStaff);
userRouter.get("/notice", getNotice);
userRouter.get("/gallery", getGalery);

export { userRouter };
