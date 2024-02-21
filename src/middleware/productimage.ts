import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cd: any) {
    cd(null, "./src/Upload/Products");
  },
  filename: (req: any, file: any, cd: any) => {
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
    file.mimetype == "image/jpeg"
  ) {
    cd(null, true);
  } else {
    cd("please upload right image");
  }
};
const Upload = multer({ storage: storage, fileFilter: multerFilter });
export default Upload;
