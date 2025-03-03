const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn ,isReviewAuthor} = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync"); // Import wrapAsync
const Listing = require("../models/listing.js"); // Import Listing model
const Review = require("../models/reviews.js"); // Import Review model
const reviewController = require ("../controllers/reviews.js");

// Post Review Route
router.post(
    "/",
    isLoggedIn,
    validateReview,
    isReviewAuthor,
    wrapAsync(reviewController.createReview));

// Delete Review Route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));
  
  module.exports = router;