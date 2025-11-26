"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.sendEmail = exports.contactUs = exports.deleteUser = exports.getSingleUser = exports.updateUser = exports.login = exports.register = void 0;
const user_1 = __importDefault(require("../model/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const contactus_1 = __importDefault(require("../model/contactus"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS_KEY,
    },
});
const register = async (req, res, next) => {
    try {
        const { firstname, lastname, mobile, email, password } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const files = req.files;
        const profileImage = files?.["profile_Image"]
            ? `${process.env.BASE_URL}/profile_Image/${files["profile_Image"][0].filename}`
            : null;
        const addUser = new user_1.default({
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
        }
        else {
            return res.json({ success: false, message: "user not created." });
        }
    }
    catch (err) { }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await user_1.default.findOne({ email });
        if (!data) {
            return res.json({ success: false, message: "user not exist" });
        }
        const passwordMatch = await bcrypt_1.default.compare(password, data.password);
        if (passwordMatch) {
            const token = jsonwebtoken_1.default.sign({ _id: data._id }, "HelloFromTheOtherSide", {
                expiresIn: "24h",
            });
            res.json({
                success: true,
                message: "User loggedin successfully!!",
                token: token,
                data: data,
            });
        }
        else {
            res.json({ success: false, message: "Incorrect Username or password." });
        }
    }
    catch (err) { }
};
exports.login = login;
const updateUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await user_1.default.findOne({ _id: id });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found." });
        }
        const files = req.files;
        const profileImage = files?.["profile_Image"]
            ? `${process.env.BASE_URL}/profile_Image/${files["profile_Image"][0].filename}`
            : null;
        const updateData = { ...req.body };
        if (profileImage) {
            updateData.profile_Image = profileImage;
            // If there is an old image, delete it
            if (user.profile_Image) {
                const oldImageFilename = path_1.default.basename(user.profile_Image); // Extract filename from URL
                const oldImagePath = path_1.default.join("./src/Upload/UserProfile", oldImageFilename);
                fs_1.default.unlink(oldImagePath, (error) => {
                    if (error) {
                        console.error("Error deleting old image:", error);
                    }
                });
            }
        }
        const updatedUser = await user_1.default.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        if (updatedUser) {
            res.json({
                success: true,
                user: updatedUser,
                message: "user Updated successfully.",
            });
        }
        else {
            res.json({ success: false, message: "user not updated." });
        }
    }
    catch (err) {
        console.log("err", err);
    }
};
exports.updateUser = updateUser;
const getSingleUser = async (req, res, next) => {
    const { id } = req.params;
    const data = await user_1.default.findById({ _id: id });
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
exports.getSingleUser = getSingleUser;
const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await user_1.default.findById(id);
        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }
        // Check if the user has a profile image
        if (user.profile_Image) {
            const imageFilename = path_1.default.basename(user.profile_Image); // Extract the filename from the URL
            const imagePath = path_1.default.join("./src/Upload/UserProfile", imageFilename); // Construct the file path
            // Delete the profile image file
            fs_1.default.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error deleting profile image:", err);
                }
                else {
                    console.log("Profile image deleted successfully:", imageFilename);
                }
            });
        }
        // Delete the user record
        await user_1.default.findByIdAndDelete(id);
        return res.json({
            success: true,
            status: 200,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.deleteUser = deleteUser;
const contactUs = async (req, res, next) => {
    try {
        const { name, mobile, email, message } = req.body;
        const addContact = new contactus_1.default({
            name,
            mobile,
            email,
            message,
        });
        const create = await addContact.save();
        if (create) {
            return res.json({ success: true, message: "message sent successfully." });
        }
        else {
            return res.json({ success: false, message: "message not send." });
        }
    }
    catch (err) { }
};
exports.contactUs = contactUs;
const sendEmail = async (to, subject, html) => {
    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to,
        subject,
        html,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await user_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Generate reset token (valid for 1 hour)
        const resetToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "defaultsecret", { expiresIn: "1h" });
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
        await (0, exports.sendEmail)(user.email, "Password Reset Request", message);
        res.status(200).json({ message: "Password reset email sent", resetUrl });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;
        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "defaultsecret");
        // Find user using decoded token
        const user = await user_1.default.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Hash password before saving
        const salt = await bcrypt_1.default.genSalt(10);
        user.password = await bcrypt_1.default.hash(newPassword, salt);
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Invalid or expired token", error });
    }
};
exports.resetPassword = resetPassword;
