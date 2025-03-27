const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken || "" });

module.exports = {
  index: async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  },

  renderNewForm: (req, res) => {
    res.render("listings/new.ejs");
  },

  createListing: async (req, res) => {
    try {
      const { listing } = req.body;

      const geoData = await geocodingClient
        .forwardGeocode({
          query: listing.location,
          limit: 1
        })
        .send();

      if (!geoData.body.features.length) {
        req.flash("error", "Invalid location provided.");
        return res.redirect("/listings/new");
      }

      const newListing = new Listing(listing);
      newListing.geometry = geoData.body.features[0].geometry;
      newListing.owner = req.user._id;

      if (req.file) {
        newListing.image = {
          url: req.file.path,
          filename: req.file.filename
        };
      }

      await newListing.save();
      req.flash("success", "New listing created successfully!");
      res.redirect(`/listings/${newListing._id}`);
    } catch (error) {
      console.error("Error creating listing:", error);
      req.flash("error", "Failed to create listing.");
      res.redirect("/listings/new");
    }
  },

  showListing: async (req, res) => {
    const listing = await Listing.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing, mapToken });
  },

  renderEditForm: async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    let originalImageUrl = listing.image?.url?.replace("/upload", "/upload/w_250") || null;
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  },

  updateListing: async (req, res) => {
    try {
      const { id } = req.params;
      const { listing } = req.body;

      const updatedListing = await Listing.findByIdAndUpdate(id, { ...listing });

      if (!updatedListing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
      }

      // 🔁 If location was changed, update coordinates
      if (listing.location) {
        const geoData = await geocodingClient
          .forwardGeocode({
            query: listing.location,
            limit: 1
          })
          .send();

        if (geoData.body.features.length) {
          updatedListing.geometry = geoData.body.features[0].geometry;
        }
      }

      // 🖼️ Update image if uploaded
      if (req.file) {
        updatedListing.image = {
          url: req.file.path,
          filename: req.file.filename
        };
      }

      await updatedListing.save();

      req.flash("success", "Listing updated successfully!");
      res.redirect(`/listings/${id}`);
    } catch (error) {
      console.error("Error updating listing:", error);
      req.flash("error", "Failed to update listing.");
      res.redirect(`/listings/${req.params.id}/edit`);
    }
  },

  destroyListing: async (req, res) => {
    try {
      await Listing.findByIdAndDelete(req.params.id);
      req.flash("success", "Listing deleted successfully!");
      res.redirect("/listings");
    } catch (error) {
      console.error("Error deleting listing:", error);
      req.flash("error", "Failed to delete listing.");
      res.redirect("/listings");
    }
  }
};
