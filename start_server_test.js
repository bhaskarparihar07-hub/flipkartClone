// start_server_test.js
const connectDatabase = require('./backend/config/database');

console.log("Running connection test with empty environment...");

// Mock environment
process.env.MONGO_URI = "";

try {
    connectDatabase();
} catch (error) {
    console.log("Caught synchronous error:", error.message);
}

// We expect the "MONGO_URI is not defined" error log from database.js
// and potentially a Mongoose Connection Error if it tries to connect anyway with undefined
