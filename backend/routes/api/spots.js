// backend/routes/api/spots.js
const express = require("express");
const { Spot } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

//* Validation for creating and updating spots
const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Please provide an address."),
  check("city")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a city."),
  check("state")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a state."),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a country."),
  check("lat").isFloat().withMessage("Please provide a valide latitude."),
  check("lng").isFloat().withMessage("Please provide a valide longitude."),
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a name"),
  check("price").isDecimal().withMessage("Please provide a valid price."),
  handleValidationErrors,
];

//* Create a new spot
router.post("/", validateSpot, async (req, res) => {
<<<<<<< HEAD
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const ownerID = req.user.id; //! Fixed. Updated code to get ownerId from req.user.id
=======
  const {
    // ownerId, //! BUG identified
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  } = req.body;
>>>>>>> main

  const ownerId = req.user.id; //! BUG FIX: Get ownerId from the authenticated user

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

// ***** EXPORTS *****/
module.exports = router;
