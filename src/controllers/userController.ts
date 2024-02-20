import { Request, Response, NextFunction } from "express";
import User from "../model/user";
import bycrypt from "bcrypt"
import jwt from "jsonwebtoken";
import Contact from "../model/contactus";

export const register: any = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const { firstname, lastname, mobile, email, password } = req.body;

        const hashedPassword = await bycrypt.hash(password, 10);

        const addUser = new User({
            firstname,
            lastname,
            mobile,
            email,
            password: hashedPassword,
            profile_Image: req.file?.filename,
        });
        const create = await addUser.save();
        if (create) {
            res.json({ success: true, message: "user created successfully." });
        } else {
            res.json({ success: false, message: "user not created." });
        }
    } catch (err) {

    }
}

export const login: any = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const data = await User.findOne({ email });
        if (!data) {
            return res.json({ success: false, message: "user not exist" });
        }

        const passwordMatch = await bycrypt.compare(password, data.password);

        if (passwordMatch) {
            const token = jwt.sign({ _id: data._id }, "HelloFromTheOtherSide", {
                expiresIn: "24h",
            });
            res.json({
                success: true,
                message: "User loggedin successfully!!",
                token: token,
            });
        } else {
            res.json({ success: false, message: "Incorrect Username or password." });
        }
    } catch (err) {

    }
}

export const getSingleUser: any = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const data = await User.findById({ _id: id });

    if (data) {
        const userData = {
            _id: data._id,
            firstname: data.firstname,
            lastname: data.lastname,
            mobile: data.mobile,
            email: data.email,
            profile_Image: data.profile_Image,
        };
        return res.json({
            success: true,
            data: userData,
            message: "user get successfully",
        });
    } else {
        return res.json({
            success: false,
            message: "User not found",
        })
    }
};

export const contactUs: any = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const { name, mobile, email, message } = req.body;

        const addContact = new Contact({
            name,
            mobile,
            email,
            message
        });
        const create = await addContact.save();
        if (create) {
            res.json({ success: true, message: "message sent successfully." });
        } else {
            res.json({ success: false, message: "message not send." });
        }
    } catch (err) {

    }
}
