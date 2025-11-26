"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: false,
    },
    mobile: {
        type: Number,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    profile_Image: {
        type: String,
        required: false,
    },
}, { timestamps: true, collection: "admin" });
const Admin = mongoose_1.default.model("Admin", adminSchema);
exports.default = Admin;
