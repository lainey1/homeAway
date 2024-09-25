// backend/routes/api/spots.js
const express = require("express");
const { Spot } = require("../../db/models");
const { SpotImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// Validation for creating and updating spots
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

// Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { spotId } = req.params; // from URL
  console.log(req.params);
  const spot = await Spot.findByPk(spotId); // find spot by ID

  // // Check if the spot exists
  // if (!spot) {
  //   return res.status(404).json({
  //     message: "Spot not found",
  //     errors: {
  //       spotId: "Spot couldn't be found",
  //     },
  //   });
  // }
  const { url, preview } = req.body;

  // Create the image for spot
  const image = await SpotImage.create({
    spotId: spot.id, //!FIX Need to associate the image with the spot
    url,
    preview,
  });

  return res.status(201).json(image);
});

// Create a new spot
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

// GET all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const spots = await Spot.findAll({
    where: {
      ownerId: userId,
    },
  });
  return res.json({ spots });
});

// GET all Spots
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
module.exports = router;
