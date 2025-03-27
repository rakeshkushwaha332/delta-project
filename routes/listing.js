const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing, saveRedirectUrl } = require("../middleware");
const listingController = require("../controllers/listings");
const reviewController = require("../controllers/reviews");
const wrapAsync = require("../utils/wrapAsync");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

/** ----------------------
 * LISTING ROUTES
 * --------------------- */

// Get all listings & Create new
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

// Form to create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Edit, Update, Delete specific listing
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Render Edit Form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// Add Review to listing (moved to controller)
router.post(
  "/:id/reviews",
  isLoggedIn,
  wrapAsync(reviewController.createReview)
);

// Optional: Delete Review — if you support deleting from listing route
// router.delete("/:id/reviews/:reviewId", isLoggedIn, wrapAsync(reviewController.destroyReview));

/** ----------------------
 * TEST ROUTE (DEV ONLY)
 * --------------------- */
router.get("/testlisting", async (req, res) => {
  try {
    let sample = new (require("../models/listing"))({
      title: "My New Villa",
      description: "By the beach",
      image: {
        url: "https://images.unsplash.com/photo-1728988914134-c14e15f91d8a?q=80&w=1470",
        filename: "default"
      },
      price: 1200,
      location: "India, Goa",
      country: "India"
    });

    await sample.save();
    console.log("Test listing saved");
    res.send("Successful testing");
  } catch (error) {
    console.error("Error saving test listing:", error);
    res.send("Error occurred during testing");
  }
});

module.exports = router;
