"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const Token_1 = require("../middleware/Token");
const categoryController_1 = require("../controllers/categoryController");
const adminController_1 = require("../controllers/adminController");
const adminToken_1 = require("../middleware/adminToken");
const productController_1 = require("../controllers/productController");
const cartController_1 = require("../controllers/cartController");
const paymentController_1 = require("../controllers/paymentController");
const wishlistController_1 = require("../controllers/wishlistController");
const uploadImages_1 = __importDefault(require("../middleware/uploadImages"));
const orderController_1 = require("../controllers/orderController");
const utils_1 = require("../constants/utils");
const userSchema_1 = require("../validation/userSchema");
const contactSchema_1 = require("../validation/contactSchema");
const categorySchema_1 = require("../validation/categorySchema");
const productSchema_1 = require("../validation/productSchema");
const orderSchema_1 = require("../validation/orderSchema");
const router = express_1.default.Router();
exports.router = router;
// user Routes
router.post("/api/register", uploadImages_1.default.fields([{ name: "profile_Image", maxCount: 1 }]), userController_1.register);
router.post("/api/login", (0, utils_1.validateRequest)(userSchema_1.loginSchema), userController_1.login);
router.get("/api/user/:id", Token_1.VerifyToken, userController_1.getSingleUser);
router.put("/api/user/:id", Token_1.VerifyToken, uploadImages_1.default.fields([{ name: "profile_Image", maxCount: 1 }]), (0, utils_1.validateRequest)(userSchema_1.registerSchema, "profile_Image", {
    maxSize: 2 * 1024 * 1024, // 2 MB
    allowedTypes: ["image/jpeg", "image/png", "image/jpg"],
}), userController_1.updateUser);
router.delete("/api/user/:id", Token_1.VerifyToken, userController_1.deleteUser);
router.post("/api/contact", (0, utils_1.validateRequest)(contactSchema_1.contactSchema), userController_1.contactUs);
router.post("/api/forget-password", (0, utils_1.validateRequest)(userSchema_1.forgotPasswordSchema), userController_1.forgotPassword);
router.post("/api/reset-password/:token", (0, utils_1.validateRequest)(userSchema_1.resetPasswordSchema), userController_1.resetPassword);
// admin Routes
router.post("/api/admin/register", uploadImages_1.default.fields([{ name: "profile_Image", maxCount: 1 }]), (0, utils_1.validateRequest)(userSchema_1.adminRegisterSchema, "profile_Image", {
    maxSize: 2 * 1024 * 1024, // 2 MB
    allowedTypes: ["image/jpeg", "image/png", "image/jpg"],
}), adminController_1.registerAdmin);
router.post("/api/admin/login", (0, utils_1.validateRequest)(userSchema_1.loginSchema), adminController_1.loginAdmin);
router.post("/api/addCategory", adminToken_1.AdminToken, (0, utils_1.validateRequest)(categorySchema_1.categorySchema), categoryController_1.category);
router.get("/api/categories", categoryController_1.getCategories);
router.get("/api/subcategories", categoryController_1.getSubCategories);
router.post("/api/addSubCategory", adminToken_1.AdminToken, (0, utils_1.validateRequest)(categorySchema_1.subCategorySchema), categoryController_1.subCategory);
router.post("/api/addproduct", adminToken_1.AdminToken, uploadImages_1.default.fields([
    { name: "img", maxCount: 1 },
    { name: "galleryimg", maxCount: 5 },
]), (0, utils_1.validateRequest)(productSchema_1.productSchema), productController_1.addProduct);
router.delete("/api/deleteproduct/:id", adminToken_1.AdminToken, productController_1.deleteProduct);
router.put("/api/updateproduct/:id", adminToken_1.AdminToken, uploadImages_1.default.fields([
    { name: "img", maxCount: 1 },
    { name: "galleryimg", maxCount: 5 },
]), (0, utils_1.validateRequest)(productSchema_1.productSchema), productController_1.updateProduct);
router.get("/api/products", productController_1.getProducts);
router.post("/api/addcart", Token_1.VerifyToken, (0, utils_1.validateRequest)(productSchema_1.cartSchema), cartController_1.addCart);
router.put("/api/updateCart", Token_1.VerifyToken, (0, utils_1.validateRequest)(productSchema_1.cartSchema), cartController_1.updateCart);
router.delete("/api/deletecart/:id", Token_1.VerifyToken, cartController_1.deleteCart);
router.get("/api/getcart", Token_1.VerifyToken, cartController_1.getCart);
router.post("/api/addWishlist", Token_1.VerifyToken, (0, utils_1.validateRequest)(productSchema_1.wishlistSchema), wishlistController_1.addWishlist);
router.get("/api/wishlist", Token_1.VerifyToken, wishlistController_1.getWishlist);
router.delete("/api/wishlist/:id", Token_1.VerifyToken, wishlistController_1.deleteWishlist);
router.post("/api/review/:id", Token_1.VerifyToken, (0, utils_1.validateRequest)(productSchema_1.reviewSchema), productController_1.addReview);
router.delete("/api/product/:productId/review/:id", Token_1.VerifyToken, productController_1.deleteReview);
router.put("/api/product/:productId/review/:id", Token_1.VerifyToken, (0, utils_1.validateRequest)(productSchema_1.reviewSchema), productController_1.updateReview);
router.post("/api/order", Token_1.VerifyToken, (0, utils_1.validateRequest)(orderSchema_1.orderSchema), orderController_1.placeOrder);
router.get("/api/usersOrders", Token_1.VerifyToken, orderController_1.getUserOrders);
router.get("/api/orderDetails/:id", Token_1.VerifyToken, orderController_1.getOrderDetails);
router.put("/api/cancel-order/:id", Token_1.VerifyToken, orderController_1.cancelOrder);
router.put("/api/update-order-status/:id", adminToken_1.AdminToken, (0, utils_1.validateRequest)(orderSchema_1.orderStatusSchema), orderController_1.updateOrderStatus);
router.post("/api/payment/create", Token_1.VerifyToken, (0, utils_1.validateRequest)(orderSchema_1.paymentSchema), paymentController_1.createPayment);
router.post("/api/payment/verify", Token_1.VerifyToken, (0, utils_1.validateRequest)(orderSchema_1.paymentVerifySchema), paymentController_1.verifyPaymentAndCreateOrder);
