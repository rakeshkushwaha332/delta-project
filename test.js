const mongoose = require('mongoose');

const MONGO_URL = "mongodb://localhost:27017/wonderlust";

async function main() {
    console.log("Connecting to database...");
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    setTimeout(() => {
        console.log("Database connection test completed successfully");
        process.exit();
    }, 2000);
}

main().catch(err => {
    console.error("Database connection failed:", err);
});
