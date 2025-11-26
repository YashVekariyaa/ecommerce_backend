"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AdminToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || typeof token !== "string") {
        return res.json({ success: false, message: "You are not authorized!" });
    }
    const mysecretkey = "HelloFromTheAdmin";
    try {
        let admin = jsonwebtoken_1.default.verify(token.replace("Bearer ", ""), mysecretkey);
        req.admin = admin;
        next();
    }
    catch (error) {
        res.status(401).send("Token is not valid");
    }
};
exports.AdminToken = AdminToken;
