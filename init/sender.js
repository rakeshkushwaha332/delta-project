// init/seed.js (or sender.js if you want)

const mongoose = require("mongoose");
const Listing = require("../models/listing");  // Make sure path is correct
const initData = require("./data");

const MONGO_URL = "mongodb://localhost:27017/wonderlust";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Database connected");

        // Clear existing data
        await Listing.deleteMany({});
        console.log("⚠️ All existing listings removed");

        // Insert new data
        await Listing.insertMany(initData.data);
        console.log("✅ Data successfully imported");

        mongoose.connection.close();  // Close connection after seeding
        console.log("🔒 Database connection closed");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    }
}

main();
