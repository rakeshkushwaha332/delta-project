const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReview = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            req.flash("error", "Listing not found.");
            return res.redirect("/listings");
        }

        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "New review created!");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.error("Error creating review:", err);
        req.flash("error", "Failed to create review.");
        res.redirect("/listings");
    }
};

module.exports.destroyReview = async (req, res) => {
    try {
        const { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review deleted!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Error deleting review:", err);
        req.flash("error", "Failed to delete review.");
        res.redirect(`/listings/${id}`);
    }
};
