"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = exports.registerAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_1 = __importDefault(require("../model/admin"));
const registerAdmin = async (req, res, next) => {
    try {
        const { name, mobile, email, password } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const files = req.files;
        const profileImage = files?.["profile_Image"]
            ? `${process.env.BASE_URL}/profile_Image/${files["profile_Image"][0].filename}`
            : null;
        const addAdmin = new admin_1.default({
            name,
            mobile,
            email,
            password: hashedPassword,
            profile_Image: profileImage,
        });
        const create = await addAdmin.save();
        if (create) {
            res.json({ success: true, message: "register successfully." });
        }
        else {
            res.json({ success: false, message: "something went wrong" });
        }
    }
    catch (err) { }
};
exports.registerAdmin = registerAdmin;
const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await admin_1.default.findOne({ email });
        if (!data) {
            return res.json({ success: false, message: "admin not exist" });
        }
        const passwordMatch = await bcrypt_1.default.compare(password, data.password);
        if (passwordMatch) {
            const token = jsonwebtoken_1.default.sign({ _id: data._id }, "HelloFromTheAdmin", {
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
    }
    catch (err) { }
};
exports.loginAdmin = loginAdmin;
