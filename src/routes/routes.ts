import express, { Router } from "express";
import UserProFile from "../middleware/profileimage";
import {
  contactUs,
  getSingleUser,
  login,
  register,
} from "../controllers/userController";
import { VerifyToken } from "../middleware/Token";
import { category, subCategory } from "../controllers/categoryController";
import { loginAdmin, registerAdmin } from "../controllers/adminController";
import AdminProfile from "../middleware/adminprofile";
import { AdminToken } from "../middleware/adminToken";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController";
import Upload from "../middleware/productimage";
import { addCart, deleteCart, getCart } from "../controllers/cartController";
import { payment, verify } from "../controllers/paymentController";
import {
  addWishlist,
  deleteWishlist,
  getWishlist,
} from "../controllers/wishlistController";
import MultiProducts from "../middleware/productgallery";
const router = express.Router();

// user Routes
router.post("/api/register", UserProFile.single("profile_Image"), register);
router.post("/api/login", login);
router.get("/api/user/:id", VerifyToken, getSingleUser);
router.post("/api/contactus", contactUs);

// admin Routes
router.post(
  "/api/admin/register",
  AdminProfile.single("profile_Image"),
  registerAdmin
);
router.post("/api/admin/login", loginAdmin);
router.post("/api/addCategory", AdminToken, category);
router.post("/api/addSubCategory", AdminToken, subCategory);
router.post(
  "/api/addproduct",
  AdminToken,
  Upload.single("img"),
  MultiProducts.array("galleryimg", 5),
  addProduct
);
router.delete("/api/deleteproduct/:id", AdminToken, deleteProduct);
router.put(
  "/api/updateproduct/:id",
  AdminToken,
  Upload.single("img"),
  updateProduct
);
router.get("/api/products", getProducts);
router.post("/api/addcart", VerifyToken, addCart);
router.delete("/api/deletecart/:id", VerifyToken, deleteCart);
router.get("/api/getcart", VerifyToken, getCart);
router.post("/api/addWishlist", VerifyToken, addWishlist);
router.get("/api/wishlist", VerifyToken, getWishlist);
router.delete("/api/wishlist/:id", VerifyToken, deleteWishlist);

router.post("/api/payment", VerifyToken, payment);
router.post("/api/verify", VerifyToken, verify);

export { router };
