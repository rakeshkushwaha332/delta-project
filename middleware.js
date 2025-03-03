const Listing =require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema} = require ("./schema.js")









module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing.");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

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

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.isReviewAuthor = async (req, res, next) => {
    let { reviewId } = req.params;
    let review = await Review.findById(reviewId);
  
    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`); // Assuming 'id' is defined elsewhere
    }
  
    next();
  };