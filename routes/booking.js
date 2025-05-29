const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing, saveRedirectUrl } = require("../middleware");
const listingController = require("../controllers/listings"); // We'll still use the listing controller for now
const wrapAsync = require("../utils/wrapAsync");

/** ----------------------
 * BOOKING ROUTES
 * --------------------- */

// New Booking Route (render booking form) - MOVED TO LISTING ROUTER
// router.post("/:id/book", isLoggedIn, wrapAsync(listingController.renderBookingForm));

// New Route to Initiate Payment
router.post("/:id/initiate-payment", isLoggedIn, wrapAsync(listingController.initiatePayment));

// New Route to Render Payment Page
router.get("/:id/payment", isLoggedIn, wrapAsync(listingController.renderPaymentPage));

// New Route to Confirm Payment
router.post("/:id/confirm-payment", isLoggedIn, wrapAsync(listingController.confirmPayment));

// New Route to Render Success Page
router.get("/:id/success", isLoggedIn, wrapAsync(listingController.renderSuccessPage));

// Route to Show User Bookings (Index for bookings)
router.get("/", isLoggedIn, wrapAsync(listingController.showUserBookings));

// Route to Delete Booking
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyBooking));

module.exports = router; 