import { Request, Response, NextFunction } from "express";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../model/admin";

export const registerAdmin: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, mobile, email, password } = req.body;

    const hashedPassword = await bycrypt.hash(password, 10);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const profileImage = files?.["profile_Image"]
      ? `${process.env.BASE_URL}/profile_Image/${files["profile_Image"][0].filename}`
      : null;

    const addAdmin = new Admin({
      name,
      mobile,
      email,
      password: hashedPassword,
      profile_Image: profileImage,
    });
    const create = await addAdmin.save();
    if (create) {
      res.json({ success: true, message: "register successfully." });
    } else {
      res.json({ success: false, message: "something went wrong" });
    }
  } catch (err) {}
};

export const loginAdmin: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const data = await Admin.findOne({ email });
    if (!data) {
      return res.json({ success: false, message: "admin not exist" });
    }

    const passwordMatch = await bycrypt.compare(password, data.password);

    if (passwordMatch) {
      const token = jwt.sign({ _id: data._id }, "HelloFromTheAdmin", {
        expiresIn: "24h",
      });
      return res.json({
        success: true,
        message: "Admin loggedin successfully!!",
        token: token,
      });
    }
    return res.json({
      success: false,
      message: "Incorrect Username or password.",
    });
  } catch (err) {}
};
