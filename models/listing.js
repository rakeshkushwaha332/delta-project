
// is code ke sath listing add hoti ha but all listing nahi dikhti
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         default: "No description provided."
//     },
//     image: {
//         type: String,
//         default: "https://images.unsplash.com/photo-1728988914134-c14e15f91d8a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         set: (v) => v === "" ? "https://images.unsplash.com/photo-1728988914134-c14e15f91d8a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     location: {
//         type: String,
//         required: true
//     },
//     country: {
//         type: String,
//         required: true
//     }
// });


// is code ke saath data import hota ha but listing adda anhi hoti

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     image: {
//         filename: {
//             type: String, // You can store the filename or a descriptive name if needed.
//             required: true
//         },
//         url: {
//             type: String, // URL of the image
//             required: true
//         }
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     location: {
//         type: String,
//         required: true
//     },
//     country: {
//         type: String,
//         required: true
//     }
// });

// const Listing = mongoose.model('Listing', listingSchema);

// module.exports = Listing;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for image object (for uploads with filename and URL)
const imageSchema = new Schema({
    filename: {
        type: String,
        required: false // Optional if using only URL
    },
    url: {
        type: String,
        required: true // URL is required if image object is used
    }
}, { _id: false }); // No separate ID for image sub-doc

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
      url: String,
        filename: String,
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews:[
        {type: Schema.Types.ObjectId,
            ref: "Review"
        }

    ],
    owner:
        {type: Schema.Types.ObjectId,
            ref: "User",
        },
        geometry: {
            type: {
                type: String, // GeoJSON type (e.g., "Point")
                enum: ["Point"], // Only "Point" is supported for now
                required: true,
            },
            coordinates: {
                type: [Number], // Array of numbers for longitude and latitude
                required: true,
            },
        },
        
        }
    
    
);

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
