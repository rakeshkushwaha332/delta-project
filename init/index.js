const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");
const MONGO_URL = "mongodb://localhost:27017/wonderlust";


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
    initData.data = initData.data.map((obj) => ({...obj,owner: "67c3c407712521afbe836545"}))
    await Listing.insertMany(initData.data);

    console.log("data was insitalized");
};
initDB();