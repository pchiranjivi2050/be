import { type Request, type Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../db/db";
import "../types/type"

export default async function AdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({
        msg: "No token in headers",
      });
      return;
    }
    let jwtPass = process.env.JWT_SECRET || "defaultKey";
    let decoded = jwt.verify(token, jwtPass);
    let userEmail = (decoded as jwt.JwtPayload).userEmail;

    let existingUser = await Admin.findOne({
      userEmail,
    });

    if (!existingUser) {
      res.status(404).json({
        msg: "No such user found in db",
      });
      return;
    }

    req.user = userEmail;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}
