"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subCategorySchema = new mongoose_1.default.Schema({
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    subcategory: {
        type: String,
        required: true,
    },
}, { timestamps: true, collection: "subcategory" });
const Subcategory = mongoose_1.default.model("Subcategory", subCategorySchema);
exports.default = Subcategory;
