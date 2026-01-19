const app = require('../backend/app');
const connectDatabase = require('../backend/config/database');
const cloudinary = require('cloudinary');

// Handling Uncaught Exception (though less critical in serverless as the function dies anyway)
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    // process.exit(1); // Don't exit in serverless, let the function finish or time out if possible, but usually fatal.
});

// Config
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: 'backend/config/config.env' });
}

// Connect to database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// For Vercel, we export the app, we do NOT call app.listen()
module.exports = app;
