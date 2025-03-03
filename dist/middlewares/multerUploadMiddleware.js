import multer from "multer";
import ErrorHandler from "../utils/utility-class.js";
const storage = multer.memoryStorage();
const fileFilter = async (req, file, callBack) => {
    if (!file)
        return callBack(new ErrorHandler("no file found", 400));
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedMimeTypes.includes(file.mimetype))
        return callBack(new ErrorHandler("Invalid file type", 400));
    return callBack(null, true); //null means error->null and true means acceptFile=>true,
};
export const uploadImageViaMulter = multer({
    storage,
    limits: {
        fileSize: 8 * 1024 * 1024,
    },
    fileFilter: fileFilter,
}).single("photo");
/*
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, "uploads");

const ensureDirecotryExists = async () => {
  try {
    await fs.access(uploadPath);
  } catch (error) {
    console.log("Directory 'uploads' didn't exist,creating now! ",error);

    await fs.mkdir(uploadPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: async (req, file, callback) => {
    await ensureDirecotryExists();
    callback(null, "uploads");
  },
  filename(req, file, callback) {
    const fileId = uuid();
    const fileExtensionName = file.originalname.split(".").pop();
    const newFileName = `${fileId}.${fileExtensionName}`;
    callback(null, newFileName);
  },
});

export const singleUpload = multer({ storage }).single("photo"); // can be accessed by multer.file.photo
*/
