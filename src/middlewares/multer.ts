import multer from "multer";
import {v4 as uuid} from  "uuid";
const storage = multer.diskStorage({

    destination(req,file,callback){
        callback(null,"uploads");
    },
    filename(req,file,callback){
        const fileId = uuid();
        const fileExtensionName = file.originalname.split(".").pop();
        const newFileName = `${fileId}.${fileExtensionName}`;
        callback(null,newFileName);
    }
})

export const singleUpload = multer({storage}).single("photo"); // can be accessed by multer.file.photo  