"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const VerifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || typeof token !== "string") {
        return res.json({ success: false, message: "You are not authorized!" });
    }
    const mysecretkey = "HelloFromTheOtherSide";
    try {
        let user = jsonwebtoken_1.default.verify(token.replace("Bearer ", ""), mysecretkey);
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).send("Token is not valid");
    }
};
exports.VerifyToken = VerifyToken;
