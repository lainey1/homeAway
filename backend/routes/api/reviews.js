const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Review } = require("../../db/models");

const router = express.Router();

//* import the check function from express-validator and the handleValidationError functions
const { check, validationResult } = require("express-validator");
// const { handleValidationErrors } = require("../../utils/validation");


//* Edit a Review

router.put("/:reviewId", requireAuth,  async (req, res) => {   //validateReview,

  try {

    const userId = req.user.id; // GET authenticated userId
    const { reviewId } = req.params; // GET from URL
    const { review: reviewText, stars } = req.body;

    const currentReview = await Review.findByPk(reviewId); // Find review by ID;

                // Check if the review exists
    if (!currentReview) {
      return res.status(404).json({
        message: "Review couldn't be found",   
      });
    }

                // Check if the user is the owner of the review
    if (currentReview.userId !== userId) {
      return res.status(403).json({
        message: "Forbidden. You are not authorized to edit this review."
      });
    }

              //   Validate the input
    const errors = {};
    if (!reviewText || typeof reviewText !== 'string' || reviewText.trim() === '' ) {
      errors.review = "Review text is required";
    }
    if (!stars || !Number.isInteger(stars) || stars < 1 || stars > 5) {
      errors.stars = "Stars must be an integer from 1 to 5";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Bad Request",
        errors
      });
    }

              // Update the review details
    currentReview.review = reviewText;
    currentReview.stars = stars;

    await currentReview.save(); //save the updated review

    return res.status(200).json(currentReview);


  } catch (error) {
    console.error('Error occurred:', error); // Log full error for debugging
    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }



});
     

// ***** EXPORTS *****/
module.exports = router;