const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");
const MONGO_URL = "mongodb+srv://rakeshkushwaha332:D0pbfjsVIAA3cNNj@cluster0.bt3rm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


main()
.then(() => {
    console.log("database connected");
})
.catch((err) => {
    console.log(err);
})


async function main() {
    await mongoose.connect(MONGO_URL);
}


const initDB = async () => {
    await Listing.deleteMany({});
        // Set the constant geometry (e.g., using the same coordinates for all listings)
        const constantGeometry = {
            type: "Point",
            coordinates: [0, 0], // Example constant coordinates
        };
    
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: "67c3c407712521afbe836545", // Assigning owner
            geometry: constantGeometry, // Assigning the constant geometry to each listing
        }));
    await Listing.insertMany(initData.data);

    console.log("data was insitalized");
};
initDB();