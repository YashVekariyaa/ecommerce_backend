import express from "express";
import UserProFile from "../middleware/profileimage";
import {
  contactUs,
  deleteUser,
  forgotPassword,
  getSingleUser,
  login,
  register,
  resetPassword,
  updateUser,
} from "../controllers/userController";
import { VerifyToken } from "../middleware/Token";
import {
  category,
  getCategories,
  getSubCategories,
  subCategory,
} from "../controllers/categoryController";
import { loginAdmin, registerAdmin } from "../controllers/adminController";
import AdminProfile from "../middleware/adminprofile";
import { AdminToken } from "../middleware/adminToken";
import {
  addProduct,
  addReview,
  deleteProduct,
  deleteReview,
  getProducts,
  getReviews,
  updateProduct,
  updateReview,
} from "../controllers/productController";
import {
  addCart,
  deleteCart,
  getCart,
  updateCart,
} from "../controllers/cartController";
import {
  createPayment,
  verifyPaymentAndCreateOrder,
} from "../controllers/paymentController";
import {
  addWishlist,
  deleteWishlist,
  getWishlist,
} from "../controllers/wishlistController";
import upload from "../middleware/uploadImages";
import {
  cancelOrder,
  getOrderDetails,
  getUserOrders,
  placeOrder,
  updateOrderStatus,
} from "../controllers/orderController";
import { validateRequest } from "../constants/utils";
import {
  adminRegisterSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validation/userSchema";
import { contactSchema } from "../validation/contactSchema";
import {
  categorySchema,
  subCategorySchema,
} from "../validation/categorySchema";
import {
  cartSchema,
  productSchema,
  reviewSchema,
  wishlistSchema,
} from "../validation/productSchema";
import {
  orderSchema,
  orderStatusSchema,
  paymentSchema,
  paymentVerifySchema,
} from "../validation/orderSchema";
const router = express.Router();

// user Routes
router.post(
  "/api/register",
  upload.fields([{ name: "profile_Image", maxCount: 1 }]),
  register
);
router.post("/api/login", validateRequest(loginSchema), login);
router.get("/api/user/:id", VerifyToken, getSingleUser);
router.put(
  "/api/user/:id",
  VerifyToken,
  upload.fields([{ name: "profile_Image", maxCount: 1 }]),
  validateRequest(registerSchema, "profile_Image", {
    maxSize: 2 * 1024 * 1024, // 2 MB
    allowedTypes: ["image/jpeg", "image/png", "image/jpg"],
  }),
  updateUser
);
router.delete("/api/user/:id", VerifyToken, deleteUser);
router.post("/api/contact", validateRequest(contactSchema), contactUs);
router.post(
  "/api/forget-password",
  validateRequest(forgotPasswordSchema),
  forgotPassword
);
router.post(
  "/api/reset-password/:token",
  validateRequest(resetPasswordSchema),
  resetPassword
);

// admin Routes
router.post(
  "/api/admin/register",
  upload.fields([{ name: "profile_Image", maxCount: 1 }]),
  validateRequest(adminRegisterSchema, "profile_Image", {
    maxSize: 2 * 1024 * 1024, // 2 MB
    allowedTypes: ["image/jpeg", "image/png", "image/jpg"],
  }),
  registerAdmin
);
router.post("/api/admin/login", validateRequest(loginSchema), loginAdmin);
router.post(
  "/api/addCategory",
  AdminToken,
  validateRequest(categorySchema),
  category
);
router.get("/api/categories", getCategories);
router.get("/api/subcategories", getSubCategories);
router.post(
  "/api/addSubCategory",
  AdminToken,
  validateRequest(subCategorySchema),
  subCategory
);
router.post(
  "/api/addproduct",
  AdminToken,
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "galleryimg", maxCount: 5 },
  ]),
  validateRequest(productSchema),
  addProduct
);
router.delete("/api/deleteproduct/:id", AdminToken, deleteProduct);
router.put(
  "/api/updateproduct/:id",
  AdminToken,
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "galleryimg", maxCount: 5 },
  ]),
  validateRequest(productSchema),
  updateProduct
);
router.get("/api/products", getProducts);
router.post("/api/addcart", VerifyToken, validateRequest(cartSchema), addCart);
router.put(
  "/api/updateCart",
  VerifyToken,
  validateRequest(cartSchema),
  updateCart
);
router.delete("/api/deletecart/:id", VerifyToken, deleteCart);
router.get("/api/getcart", VerifyToken, getCart);
router.post(
  "/api/addWishlist",
  VerifyToken,
  validateRequest(wishlistSchema),
  addWishlist
);
router.get("/api/wishlist", VerifyToken, getWishlist);
router.delete("/api/wishlist/:id", VerifyToken, deleteWishlist);
router.post(
  "/api/review/:id",
  VerifyToken,
  validateRequest(reviewSchema),
  addReview
);
router.delete("/api/product/:productId/review/:id", VerifyToken, deleteReview);
router.put(
  "/api/product/:productId/review/:id",
  VerifyToken,
  validateRequest(reviewSchema),
  updateReview
);

router.post(
  "/api/order",
  VerifyToken,
  validateRequest(orderSchema),
  placeOrder
);
router.get("/api/usersOrders", VerifyToken, getUserOrders);
router.get("/api/orderDetails/:id", VerifyToken, getOrderDetails);
router.put("/api/cancel-order/:id", VerifyToken, cancelOrder);

router.put(
  "/api/update-order-status/:id",
  AdminToken,
  validateRequest(orderStatusSchema),
  updateOrderStatus
);

router.post(
  "/api/payment/create",
  VerifyToken,
  validateRequest(paymentSchema),
  createPayment
);
router.post(
  "/api/payment/verify",
  VerifyToken,
  validateRequest(paymentVerifySchema),
  verifyPaymentAndCreateOrder
);

export { router };
