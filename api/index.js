const app = require('../backend/app');
const connectDatabase = require('../backend/config/database');
const cloudinary = require('cloudinary');

// Config
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: 'backend/config/database.env' });
}

// Connect to database
connectDatabase();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// For Vercel, we export the app, we do NOT call app.listen()
module.exports = app;
