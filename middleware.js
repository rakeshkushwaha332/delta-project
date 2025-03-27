const Listing = require("./models/listing");
const Review = require("./models/reviews"); // ✅ FIXED: Import Review model
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// ✅ Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to perform this action.");
    return res.redirect("/login");
  }
  next();
};

// ✅ Save redirect URL for after login
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// ✅ Check if current user owns the listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    if (!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the owner of this listing.");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong.");
    next(err);
  }
};

// ✅ Joi schema validation for listings
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// ✅ Joi schema validation for reviews
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// ✅ Check if current user owns the review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      req.flash("error", "Review not found.");
      return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review.");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while verifying review author.");
    next(err);
  }
};
