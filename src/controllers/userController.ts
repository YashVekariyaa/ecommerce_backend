import { Request, Response, NextFunction } from "express";
import User from "../model/user";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import Contact from "../model/contactus";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS_KEY,
  },
});

export const register: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstname, lastname, mobile, email, password } = req.body;

    const hashedPassword = await bycrypt.hash(password, 10);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const profileImage = files?.["profile_Image"]
      ? `${process.env.BASE_URL}/profile_Image/${files["profile_Image"][0].filename}`
      : null;

    const addUser = new User({
      firstname,
      lastname,
      mobile,
      email,
      password: hashedPassword,
      profile_Image: profileImage,
    });
    const create = await addUser.save();
    if (create) {
      return res.json({
        success: true,
        user: create,
        message: "user created successfully.",
      });
    } else {
      return res.json({ success: false, message: "user not created." });
    }
  } catch (err) {}
};

export const login: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
        data: data,
      });
    } else {
      res.json({ success: false, message: "Incorrect Username or password." });
    }
  } catch (err) {}
};

export const updateUser: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const user: any = await User.findOne({ _id: id });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const profileImage = files?.["profile_Image"]
      ? `${process.env.BASE_URL}/profile_Image/${files["profile_Image"][0].filename}`
      : null;
    const updateData: any = { ...req.body };
    if (profileImage) {
      updateData.profile_Image = profileImage;
      // If there is an old image, delete it
      if (user.profile_Image) {
        const oldImageFilename = path.basename(user.profile_Image); // Extract filename from URL
        const oldImagePath = path.join(
          "./src/Upload/UserProfile",
          oldImageFilename
        );
        fs.unlink(oldImagePath, (error) => {
          if (error) {
            console.error("Error deleting old image:", error);
          }
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    if (updatedUser) {
      res.json({
        success: true,
        user: updatedUser,
        message: "user Updated successfully.",
      });
    } else {
      res.json({ success: false, message: "user not updated." });
    }
  } catch (err) {
    console.log("err", err);
  }
};

export const getSingleUser: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const data = await User.findById({ _id: id });

  if (!data) {
    return res.json({
      success: false,
      message: "User not found",
    });
  }

  return res.json({
    success: true,
    data: data,
    message: "user get successfully",
  });
};

export const deleteUser: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user has a profile image
    if (user.profile_Image) {
      const imageFilename = path.basename(user.profile_Image); // Extract the filename from the URL
      const imagePath = path.join("./src/Upload/UserProfile", imageFilename); // Construct the file path

      // Delete the profile image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting profile image:", err);
        } else {
          console.log("Profile image deleted successfully:", imageFilename);
        }
      });
    }

    // Delete the user record
    await User.findByIdAndDelete(id);

    return res.json({
      success: true,
      status: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const contactUs: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, mobile, email, message } = req.body;

    const addContact = new Contact({
      name,
      mobile,
      email,
      message,
    });
    const create = await addContact.save();
    if (create) {
      return res.json({ success: true, message: "message sent successfully." });
    } else {
      return res.json({ success: false, message: "message not send." });
    }
  } catch (err) {}
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    // Send email
    const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;
    const message = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p style="color: #555;">Click the button below to reset your password. This link will expire in 1 hour.</p>
                <a href="${resetUrl}" target="_blank" 
                   style="display: inline-block; padding: 10px 20px; margin-top: 10px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
                    Reset Password
                </a>
                <p style="margin-top: 20px; color: #777;">If you did not request a password reset, please ignore this email.</p>
            </div>
        `;

    await sendEmail(user.email, "Password Reset Request", message);

    res.status(200).json({ message: "Password reset email sent", resetUrl });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Verify token
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultsecret"
    );

    // Find user using decoded token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash password before saving
    const salt = await bycrypt.genSalt(10);
    user.password = await bycrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Invalid or expired token", error });
  }
};
