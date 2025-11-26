"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
async function connects() {
    try {
        await mongoose_1.default.connect("mongodb://127.0.0.1/ecom-ts", {});
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Error connecting to the database:", error);
    }
}
exports.default = connects;
