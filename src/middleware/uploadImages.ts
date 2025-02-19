import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    if (file.fieldname === "profile_Image") {
      // Check if the request is for admin registration
      if (req.originalUrl.includes("/api/admin/register")) {
        cb(null, "./src/Upload/AdminProfile");
      } else {
        cb(null, "./src/Upload/UserProfile");
      }
    } else if (file.fieldname === "img") {
      cb(null, "./src/Upload/Products");
    } else if (file.fieldname === "galleryimg") {
      cb(null, "./src/Upload/Products/galleryImage");
    } else {
      cb(new Error("Invalid fieldname"));
    }
  },
  filename: (req: any, file: any, cb: any) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const multerFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Please upload a valid image"));
  }
};

const upload = multer({
  storage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
