// import multer from "multer";

// export const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./Public/Profile");
//     },
//     filename :function(req,file,cb) {
//         cb(null,`${Date.now()}${file.originalname}`)
//     }
// });
import {v2 as cloudinary} from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import env from "dotenv"

env.config()


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});



export const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : "Blogs",
        format: async (req, file) => {
            const allowedFormat = ["jpg","jpeg","png"]
            if (!allowedFormat.includes(file.mimetype.split("/")[1])) {
                throw new Error("Unsupported file format")
                
            } else {
                return file.mimetype.split("/")[1]
            }
     
        },
        public_id: (req,file) => `${Date.now()}${file.originalname.split(".")[0]}`
    }
})