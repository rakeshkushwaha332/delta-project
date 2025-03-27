const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor
} = require("../middleware");

const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/reviews");

// POST /listings/:id/reviews - Create a review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// DELETE /listings/:id/reviews/:reviewId - Delete a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
