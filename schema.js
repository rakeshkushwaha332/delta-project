const Joi = require("joi");

// Schema for validating a listing
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.alternatives().try(
      Joi.string().uri(),                    // for URL
      Joi.object({                           // for Cloudinary-style object
        url: Joi.string().uri().required(),
        filename: Joi.string().required()
      }),
      Joi.allow(null, "")                    // or allow empty if not uploading
    )
  }).required()
});

// Schema for validating a review
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
  }).required()
});
