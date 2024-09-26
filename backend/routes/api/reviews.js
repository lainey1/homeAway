// backend/routes/api/reviews.js
const express = require("express");
const { Review, ReviewImage, Spot, User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

//* GET all reviews by the Current User
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  console.log(">>>>>>>>>USER ID: ", userId);

  const reviews = await Review.findAll({
    where: {
      userId: userId,
    },

    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        as: "Spot",
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
          "previewImage",
        ],
      },
      {
        model: ReviewImage,
        as: "ReviewImages",
        attributes: ["id", "url"],
      },
    ],
  });

  return res.json({ Reviews: reviews }); // Wrap the reviews in an object
});

module.exports = router;
