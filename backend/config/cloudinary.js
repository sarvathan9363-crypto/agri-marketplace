const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'yzyfuhna',
  api_key: process.env.CLOUDINARY_API_KEY || '677127576355827',
  api_secret: process.env.CLOUDINARY_API_SECRET || '2DkQOgZMYwXoWrxVgsU7KzIDKWE',
  secure: true,
});

module.exports = cloudinary;
