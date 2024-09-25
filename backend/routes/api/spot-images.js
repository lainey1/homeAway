// backend/routes/api/spot-images.js
const express = require("express");
const { Spot } = require("../../db/models");
const { SpotImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// DELETE a Spot by ID
router.delete("/:imageId", requireAuth, async (req, res) => {
  console.log("hello");
  const { imageId } = req.params; // Extract imageId from route parameters
  console.log(imageId);
  const userId = req.user.id; // Get the current user's ID from authentication

  // Find the image by ID
  const image = await SpotImage.findByPk(imageId);

  // If the spot doesn't exist, return a 404 error
  if (!image) {
    return res.status(404).json({
      title: "Resource Not Found",
      message: "Spot Image couldn't be found",
    });
  }

  // Find the spot by ID
  const spot = await Spot.findByPk(imageId);

  // Check if the authenticated user is the owner of the spot
  if (spot.ownerId !== userId) {
    return res.status(403).json({
      title: "Forbidden",
      message: "Only the owner can delete this spot image.",
    });
  }

  // If the user is the owner, proceed to delete the spot
  await image.destroy();

  // Return success message after deletion
  return res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
