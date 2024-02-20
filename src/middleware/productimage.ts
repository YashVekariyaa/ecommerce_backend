import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cd: any) {
    cd(null, "./src/Upload/Products");
  },
  filename: (req: any, file: any, cd: any) => {
    // console.log('first', file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    // console.log('file', file)
    cd(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const multerFilter = (req: any, file: any, cd: any) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/mp4" ||
    file.mimetype == "image/webp"
  ) {
    cd(null, true);
  } else {
    cd("please upload reght image");
  }
};
const Upload = multer({ storage: storage, fileFilter: multerFilter });
export default Upload;
