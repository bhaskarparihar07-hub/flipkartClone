const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

const connectDatabase = () => {
    if (!MONGO_URI) {
        console.error("MONGO_URI is not defined");
        // In a serverless environment, we might want to throw to fail fast, 
        // but logging is critical first.
    }
    mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Mongoose Connected");
        })
        .catch((err) => {
            console.error("Mongoose Connection Error:", err);
            // Don't exit in serverless - let the function handle requests even if DB fails
            // This allows us to see logs and debug the actual issue
        });
}

module.exports = connectDatabase;