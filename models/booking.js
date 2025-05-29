const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true,
    min: 1
  },
  guestName: {
    type: String,
    required: true
  },
  guestAge: {
    type: Number,
    required: true,
    min: 1
  },
  guestSex: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentIntentId: String // To store the ID from the payment gateway
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking; 