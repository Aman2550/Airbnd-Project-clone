const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  });
  
  // Multer storage for Cloudinary
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ['png', 'jpg', 'jpeg']
    }
  });

  module.exports = {
    cloudinary,
    storage,
   
  };