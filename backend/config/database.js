const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

const connectDatabase = () => {
    if (!MONGO_URI) {
        console.log('MONGO_URI is not defined in environment variables');
        return;
    }

    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
        socketTimeoutMS: 45000, // Increase to 45 seconds
    })
        .then(() => {
            console.log("Mongoose Connected");
        })
        .catch((err) => {
            console.error('MongoDB Connection Error:', err.message);
        });
}

module.exports = connectDatabase;