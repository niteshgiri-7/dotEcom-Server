import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";
//TODO:use S3 bucket to store and serve the images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "uploads");
const ensureDirecotryExists = async () => {
    try {
        await fs.access(uploadPath);
    }
    catch (error) {
        console.log("Directory 'uploads' didn't exist,creating now! ", error);
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
