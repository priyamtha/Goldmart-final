import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'goldmart_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || '1234567890',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret_key',
});

export const uploadToCloudinary = async (fileBuffer, folder = 'goldmart_products') => {
  return new Promise((resolve, reject) => {
    // If Cloudinary keys are standard dummy values, return a data URI fallback
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'goldmart_cloud') {
      const mime = 'image/jpeg';
      const base64 = fileBuffer.toString('base64');
      return resolve({
        secure_url: `data:${mime};base64,${base64}`,
        public_id: `goldmart_local_${Date.now()}`
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
