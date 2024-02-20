import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

export const VerifyToken: any = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token || typeof token !== "string") {
    return res.json({ success: false, message: "You are not authorized!" });
  }
  const mysecretkey = "HelloFromTheOtherSide";
  try {
    let user = jwt.verify(token.replace("Bearer ", ""), mysecretkey);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Token is not valid");
  }
};
