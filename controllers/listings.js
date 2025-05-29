const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const Booking = require("../models/booking"); // Import Booking model

// Initialize geocoding client with error handling
let geocodingClient;
try {
  geocodingClient = mbxGeocoding({ accessToken: mapToken });
} catch (error) {
  console.error("Error initializing Mapbox geocoding client:", error);
}

// Helper function for geocoding
const getCoordinates = async (location) => {
  try {
    if (!geocodingClient) {
      throw new Error("Mapbox geocoding client not initialized");
    }

    const geoData = await geocodingClient
      .forwardGeocode({
        query: location,
        limit: 1,
        types: ['place', 'address', 'neighborhood', 'locality', 'country']
      })
      .send();

    if (!geoData.body.features.length) {
      throw new Error("No location found");
    }

    return geoData.body.features[0].geometry;
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
};

module.exports = {
  index: async (req, res) => {
    const { sort, filter } = req.query;
    let query = {};
    let sortOptions = {};

    // Handle filtering
    if (filter) {
      if (filter.startsWith('price_')) {
        const [_, range] = filter.split('_');
        if (range === '0_100') {
          query.price = { $gte: 0, $lte: 100 };
        } else if (range === '100_500') {
          query.price = { $gt: 100, $lte: 500 };
        } else if (range === '500_plus') {
          query.price = { $gt: 500 };
        }
      } else if (filter.startsWith('type_')) {
        const [_, propertyType] = filter.split('_');
        query.propertyType = propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
      } else if (filter.startsWith('amenity_')) {
        const [_, amenity] = filter.split('_');
        query.amenities = amenity.charAt(0).toUpperCase() + amenity.slice(1);
      } else if (filter === 'rating_4_plus') {
        query['reviews.rating'] = { $gte: 4 };
      }
    }

    // Handle sorting
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOptions = { price: 1 };
          break;
        case 'price_desc':
          sortOptions = { price: -1 };
          break;
        case 'rating_desc':
          sortOptions = { 'reviews.rating': -1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 }; // Default sort by newest
      }
    } else {
      sortOptions = { createdAt: -1 }; // Default sort by newest
    }

    const allListings = await Listing.find(query).sort(sortOptions);
    res.render("listings/index.ejs", { 
      allListings,
      currentSort: sort,
      currentFilter: filter
    });
  },

  renderNewForm: (req, res) => {
    res.render("listings/new.ejs");
  },

  createListing: async (req, res) => {
    try {
      const { listing } = req.body;

      // Get coordinates
      const geometry = await getCoordinates(listing.location);

      const newListing = new Listing(listing);
      newListing.geometry = geometry;
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
      req.flash("error", error.message || "Failed to create listing. Please check the location.");
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

      const updatedListing = await Listing.findById(id);
      if (!updatedListing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
      }

      // Update basic fields
      Object.assign(updatedListing, listing);

      // Update coordinates if location changed
      if (listing.location && listing.location !== updatedListing.location) {
        try {
          const geometry = await getCoordinates(listing.location);
          updatedListing.geometry = geometry;
        } catch (error) {
          req.flash("error", "Could not update location coordinates. Please try a different location.");
          return res.redirect(`/listings/${id}/edit`);
        }
      }

      // Update image if uploaded
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
  },

  searchListings: async (req, res) => {
    const { q } = req.query;

    if (!q) {
      return res.redirect("/listings");
    }

    const searchQuery = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    };

    const allListings = await Listing.find(searchQuery);

    res.render("listings/index", {
      allListings,
      searchQuery: q,
    });
  },

  // Render Booking Form
  renderBookingForm: async (req, res) => {
    try {
      console.log("Attempting to render booking form...");
      const { id } = req.params; // booking ID
      console.log("Listing ID from params:", id);

      // Find the listing
      const listing = await Listing.findById(id).populate('owner');
      console.log("Listing found:", listing ? listing._id : "None");

      if (!listing) {
        console.log("Listing not found, redirecting.");
        req.flash("error", "Listing not found.");
        return res.redirect("/listings"); // Redirect to listings if booking not found
      }

      // Check if the logged-in user is the owner of the booking (optional but recommended)
      // This check seems out of place here as this is for creating a booking,
      // not viewing an existing one. I will remove this check.
      // if (!booking.user.equals(req.user._id)) {
      //     req.flash("error", "You are not authorized to view this payment page.");
      //     return res.redirect("/listings"); // Or redirect to the user's bookings page
      // }

      console.log("Rendering booking form for listing:", listing.title);
      res.render("listings/book.ejs", { listing });

    } catch (error) {
      console.error("Error rendering booking form page:", error);
      req.flash("error", error.message || "Failed to load booking page. Please try again.");
      res.redirect("/listings"); // Redirect to listings on error
    }
  },

  // New Route to Initiate Payment
  initiatePayment: async (req, res) => {
    try {
      const { id } = req.params; // listing ID
      const bookingDetails = req.body.booking;
      const userId = req.user._id;

      // Find the listing
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
      }

      // Calculate total price (simple calculation based on nights)
      const checkIn = new Date(bookingDetails.checkInDate);
      const checkOut = new Date(bookingDetails.checkOutDate);
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const numberOfNights = timeDiff / (1000 * 3600 * 24);

      if (numberOfNights <= 0 || isNaN(numberOfNights)) {
          req.flash("error", "Invalid dates selected.");
          return res.redirect(`/listings/${id}/book`); // Redirect back to the booking form
      }

      const totalPrice = listing.price * numberOfNights;

      // Create a new booking instance
      const newBooking = new Booking({
        listing: listing._id,
        user: userId,
        checkInDate: bookingDetails.checkInDate,
        checkOutDate: bookingDetails.checkOutDate,
        guests: bookingDetails.guests,
        guestName: bookingDetails.guestName,
        guestAge: bookingDetails.guestAge,
        guestSex: bookingDetails.guestSex,
        totalPrice: totalPrice,
        paymentStatus: 'completed' // Set status to completed immediately
      });

      // Save the booking to the database
      await newBooking.save();

      console.log("Booking saved and marked as completed:", newBooking);

      // Redirect directly to the success page
      req.flash("success", "Booking successful!");
      res.redirect(`/bookings/${newBooking._id}/success`);

    } catch (error) {
      console.error("Error initiating payment:", error);
      req.flash("error", error.message || "Failed to initiate booking. Please try again.");
      // Redirect back to the booking form or listing page
      const listingId = req.params.id; // Get listing ID from params
      res.redirect(`/listings/${listingId}/book`); // Redirect back to the booking form
    }
  },

  // Render Payment Page
  renderPaymentPage: async (req, res) => {
    try {
      const { id } = req.params; // booking ID

      // Find the booking
      const booking = await Booking.findById(id).populate('listing').populate('user');

      if (!booking) {
        req.flash("error", "Booking not found.");
        return res.redirect("/listings"); // Redirect to listings if booking not found
      }

      // Check if the logged-in user is the owner of the booking (optional but recommended)
      if (!booking.user.equals(req.user._id)) {
          req.flash("error", "You are not authorized to view this payment page.");
          return res.redirect("/listings"); // Or redirect to the user's bookings page
      }

      // Here you would typically interact with your payment gateway
      // to get details needed for the frontend (e.g., client secret).
      // For now, we just pass the booking details.

      res.render("listings/payment.ejs", { booking });

    } catch (error) {
      console.error("Error rendering payment page:", error);
      req.flash("error", error.message || "Failed to load payment page. Please try again.");
      res.redirect("/listings"); // Redirect to listings on error
    }
  },

  // New Route to Confirm Payment
  confirmPayment: async (req, res) => {
    try {
      const { id } = req.params; // booking ID

      // Find the booking and update its status
      const booking = await Booking.findByIdAndUpdate(id, { paymentStatus: 'completed' }, { new: true });

      if (!booking) {
        req.flash("error", "Booking not found.");
        return res.status(404).json({ success: false, message: "Booking not found." });
      }

      // In a real application, you might also save payment gateway transaction IDs here.

      console.log("Booking payment confirmed:", booking);

      // Send a success response (the frontend will handle the redirect)
      res.status(200).json({ success: true, message: "Payment confirmed!" });

    } catch (error) {
      console.error("Error confirming payment:", error);
      // Send an error response
      res.status(500).json({ success: false, message: error.message || "Failed to confirm payment." });
    }
  },

  // New Route to Render Success Page
  renderSuccessPage: async (req, res) => {
    try {
      const { id } = req.params; // booking ID

      // Find the booking
      const booking = await Booking.findById(id).populate('listing').populate('user');

      if (!booking || booking.paymentStatus !== 'completed') {
        req.flash("error", "Booking not found or payment not confirmed.");
        return res.redirect("/listings"); // Redirect if booking not found or not paid
      }

      // Render the success page, passing the booking details
      res.render("bookings/success.ejs", { booking });

    } catch (error) {
      console.error("Error rendering success page:", error);
      req.flash("error", error.message || "Failed to load success page.");
      res.redirect("/listings"); // Redirect to listings on error
    }
  },

  // New Route to Show User Bookings
  showUserBookings: async (req, res) => {
    try {
      const userId = req.user._id;

      // Find bookings for the logged-in user and populate listing details
      const myBookings = await Booking.find({ user: userId }).populate('listing');

      console.log("Fetching bookings for user:", userId);
      console.log("Found bookings:", myBookings.length);

      // Render the view to display user's bookings
      res.render("bookings/index.ejs", { myBookings });

    } catch (error) {
      console.error("Error fetching user bookings:", error);
      req.flash("error", error.message || "Failed to load your bookings.");
      res.redirect("/listings"); // Redirect to listings on error
    }
  },

  // Route to Delete Booking
  destroyBooking: async (req, res) => {
    try {
      const { id } = req.params; // booking ID

      // Find the booking and check if the logged-in user is the owner
      const booking = await Booking.findById(id);
      if (!booking) {
        req.flash("error", "Booking not found.");
        return res.redirect("/bookings"); // Redirect to bookings index
      }

      // Optional: Add authorization check if you want only the booking owner to delete
      // if (!booking.user.equals(req.user._id)) {
      //     req.flash("error", "You are not authorized to delete this booking.");
      //     return res.redirect("/bookings"); // Or redirect to the user's bookings page
      // }

      // Delete the booking
      await Booking.findByIdAndDelete(id);

      req.flash("success", "Booking deleted successfully!");
      res.redirect("/bookings"); // Redirect back to the user's bookings page

    } catch (error) {
      console.error("Error deleting booking:", error);
      req.flash("error", error.message || "Failed to delete booking.");
      res.redirect("/bookings"); // Redirect to bookings index on error
    }
  },
};
