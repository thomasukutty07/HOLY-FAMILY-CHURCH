import cloudinary from '../Config/cloudinary.js'
import streamifier from "streamifier"; 

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "church" }, 
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(error);
                } else {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream); 
    }); 
};

export default uploadToCloudinary;
