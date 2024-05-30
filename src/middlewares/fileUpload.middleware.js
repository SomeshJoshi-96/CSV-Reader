import multer from "multer";
import path from "path";
import { customErrorHandler } from "./errorHandler.js";
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/csvfiles/");
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

export const uploadFile = multer({
  storage: storageConfig,
  //file filter to check csv files
  fileFilter: (req, file, cb) => {
    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".csv") {
      return cb(
        new customErrorHandler(400, "Only CSV files are allowed!"),
        false
      );
    }
    cb(null, true);
  },
});
