"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contactSchema = new mongoose_1.default.Schema({
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
    message: {
        type: String,
        required: false,
    }
}, { timestamps: true, collection: "contactus" });
const Contact = mongoose_1.default.model("Contact", contactSchema);
exports.default = Contact;
