import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      admin: any;
    }
  }
}

export const AdminToken: any = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token || typeof token !== "string") {
    return res.json({ success: false, message: "You are not authorized!" });
  }
  const mysecretkey = "HelloFromTheAdmin";
  try {
    let admin = jwt.verify(token.replace("Bearer ", ""), mysecretkey);
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).send("Token is not valid");
  }
};
