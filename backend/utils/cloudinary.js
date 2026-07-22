import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dpxb23gqp',
  api_key: process.env.CLOUDINARY_API_KEY || '296659779344485',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'xT5FwK9f9B-m_yMhG1T-67995', // working example or fallback
});

export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'hospital_management_profile' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};
