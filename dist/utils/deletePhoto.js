import { unlink } from "fs/promises";
const deletePhotoOnError = async (filePath) => {
    try {
        await unlink(filePath);
        console.log("File deleted On Error");
    }
    catch (error) {
        console.log("couldn't delete file", error);
    }
};
export default deletePhotoOnError;
