const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Optional image schema (in case of upload support)
const imageSchema = new Schema({
    filename: {
        type: String
    },
    url: {
        type: String,
        required: true
    }
}, { _id: false });

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "No description provided."
    },
    image: {
        type: imageSchema,
        default: {
            url: "https://images.unsplash.com/photo-1728988914134-c14e15f91d8a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            filename: ""
        }
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
    propertyType: {
        type: String,
        enum: ['House', 'Apartment', 'Villa', 'Condo', 'Cottage', 'Cabin', 'Studio'],
        required: true,
        default: 'House'
    },
    amenities: [{
        type: String,
        enum: ['WiFi', 'Kitchen', 'Pool', 'Parking', 'Air Conditioning', 'Washer', 'Dryer', 'TV', 'Gym', 'Elevator', 'Hot Tub', 'BBQ Grill', 'Fireplace', 'Workspace']
    }],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: false // Set to false in case not using map feature yet
        },
        coordinates: {
            type: [Number],
            required: false
        }
    }
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
