// backend/routes/api/spots.js
const express = require("express");
const { Spot } = require("../../db/models");
const { SpotImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Review, User, ReviewImage } = require("../../db/models");
const { Op, fn, col } = require("sequelize"); // Import Sequelize functions

const router = express.Router();

//* Validation for creating and updating spots
const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price").isDecimal().withMessage("Please provide a valid price."),
  handleValidationErrors,
];

//* Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { spotId } = req.params; // from URL
  const userId = req.user.id; // Get the current user's ID from authentication
  console.log(req.params);
  const spot = await Spot.findByPk(spotId); // find spot by ID

  // Check if the spot exists
  if (!spot) {
    return res.status(404).json({
      message: "Spot not found",
      errors: {
        spotId: "Spot couldn't be found",
      },
    });
  }

  // Check if the authenticated user is the owner of the spot
  if (spot.ownerId !== userId) {
    return res.status(403).json({
      title: "Forbidden",
      message: "Only the owner can add images to this spot.",
    });
  }
  const { url, preview } = req.body;

  // Create the image for spot
  const image = await SpotImage.create({
    spotId: spot.id, //!FIX Need to associate the image with the spot
    url,
    preview,
  });

  // Create a response object without createdAt and updatedAt
  const response = {
    id: image.id,
    spotId: image.spotId,
    url: image.url,
    preview: image.preview,
  };

  return res.status(201).json(response);
});

//* GET details of a Spot by ID
router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params; // GET from URL

  const spot = await Spot.findByPk(spotId, {
    include: [
      {
        model: Review,
        attributes: [
          [fn("COUNT", col("Reviews.id")), "reviewCount" || 0],
          [fn("AVG", col("stars")), "avgStarRating" || 0],
        ],
        required: false,
      },
      {
        model: SpotImage,
        as: "SpotImages",
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
    group: ["Spot.id", "Owner.id", "SpotImages.id", "Reviews.id"], // Group by spot ID to aggregate correctly
  });

  // Check if the spot exists
  if (!spot) {
    return res.status(404).json({
      message: "Spot not found",
      errors: {
        spotId: "Spot couldn't be found",
      },
    });
  }

  // Prepare response object
  const { previewImage, ...spotDetails } = spot.toJSON();

  // If reviews are included, merge their results into the response
  const reviews = spot.Reviews[0] || {}; // Get first review if it exists
  spotDetails.numReviews = reviews.reviewCount || 0;
  spotDetails.avgStarRating = reviews.avgStarRating || 0;

  return res.status(200).json(spotDetails);
});

//* Edit a Spot
router.put("/:spotId", requireAuth, validateSpot, async (req, res) => {
  const userId = req.user.id; // GET authenticated userId
  const { spotId } = req.params; // GET from URL
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const spot = await Spot.findByPk(spotId); // Find spot by ID;

  // Check if the spot exists
  if (!spot) {
    return res.status(404).json({
      message: "Spot not found",
      errors: {
        spotId: "Spot couldn't be found",
      },
    });
  }

  // Check if the authenticated user is the spot's owner
  if (spot.ownerId !== userId) {
    return res.status(200).json({
      message: "Forbidden",
      errors: {
        authorization: "Only the owner can edit this spot",
      },
    });
  }

  //Update the spot with new details
  spot.address = address;
  spot.city = city;
  spot.state = state;
  spot.country = country;
  spot.lat = lat;
  spot.lng = lng;
  spot.name = name;
  spot.description = description;
  spot.price = price;

  await spot.save(); // save the updated spot

  // response with updated spot
  return res.status(200).json(spot);
});

//* Create a new spot
router.post("/", validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const ownerId = req.user.id; // Get ownerId from the authenticated user

  const spot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });
  return res.status(201).json(spot);
});

//* Create a Review for a Spot based on the Spot's id

router.post("/:spotId/reviews", requireAuth, async (req, res) => {
  try {
    const { review, stars } = req.body;
    const { spotId } = req.params;
    const userId = req.user.id;

    // Check if the user has already submitted a review for this spot
    const errors = {};
    const existingReview = await Review.findOne({
      where: { spotId, userId },
    });

    if (existingReview) {
      return res
        .status(500)
        .json({ message: "User already has a review for this spot" });
    }
    // Validate the input
    if (!review || typeof review !== "string" || review.trim() === "") {
      errors.review = "Review text is required";
    }
    if (!stars || !Number.isInteger(stars) || stars < 1 || stars > 5) {
      errors.stars = "Stars must be an integer from 1 to 5";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Bad Request",
        errors,
      });
    }

    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    // Create a new review
    const newReview = await Review.create({
      userId,
      spotId,
      review,
      stars,
    });

    // Return the newly created review
    return res.status(201).json({
      id: newReview.id,
      userId: newReview.userId,
      spotId: newReview.spotId,
      review: newReview.review,
      stars: newReview.stars,
      createdAt: newReview.createdAt,
      updatedAt: newReview.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message, // For debugging, but avoid sending this in production
    });
  }
});

//* GET all reviews for a spot
router.get("/:spotId/reviews", async (req, res) => {
  const { spotId } = req.params;

  // Check if the spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Fetch reviews for the spot, include associated User and ReviewImages
  const reviews = await Review.findAll({
    where: { spotId },
    include: [
      {
        model: User,
        as: "User", // Use the alias defined in the association
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        as: "ReviewImages",
        attributes: ["id", "url"],
      },
    ],
  });

  return res.status(200).json({ Reviews: reviews });
});

//* GET all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const spots = await Spot.findAll({
    where: {
      ownerId: userId,
    },
  });
  return res.json({ spots });
});

//* GET all Spots
router.get("/", async (req, res) => {
  const spots = await Spot.findAll();

  return res.json(spots);
});

// DELETE a Spot by ID
router.delete("/:spotId", requireAuth, async (req, res) => {
  const { spotId } = req.params; // Extract spotId from route parameters
  const userId = req.user.id; // Get the current user's ID from authentication

  // Find the spot by ID
  const spot = await Spot.findByPk(spotId);

  // If the spot doesn't exist, return a 404 error
  if (!spot) {
    return res.status(404).json({
      title: "Resource Not Found",
      message: "The requested resource couldn't be found.",
    });
  }

  // Check if the authenticated user is the owner of the spot
  if (spot.ownerId !== userId) {
    return res.status(403).json({
      title: "Forbidden",
      message: "You are not authorized to delete this spot.",
    });
  }

  // If the user is the owner, proceed to delete the spot
  await spot.destroy();

  // Return success message after deletion
  return res.status(200).json({
    message: "Successfully deleted",
  });
});

// Exports

// ***** EXPORTS *****/

module.exports = router;
//hello
