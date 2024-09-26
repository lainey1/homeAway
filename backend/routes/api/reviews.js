const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Review, ReviewImage } = require("../../db/models");
const { check, validationResult} = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

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

//* Add an image to a review by reviewId

router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id; // The authenticated user's id
  const { url } = req.body;

          // Find the review by id
  const review = await Review.findByPk(reviewId, {
    include: { model: ReviewImage } // Assuming a Review has many ReviewImages
  });

         // Error handling: If review is not found, return a 404 error
  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found"
    });
  }

         // Authorization check: Ensure the review belongs to the current user
  if (review.userId !== userId) {
    return res.status(403).json({
      message: 'You are not authorized to add images to this review'
    });
  }
  console.log("review.ReviewImages  =  ", review.ReviewImages)
        // Check if the review already has 10 images
  if (review.ReviewImages.length >= 10) {
    return res.status(403).json({
      message: 'Maximum number of images for this resource was reached'
    });
  }
       // Create a new image for the review
  const newImage = await ReviewImage.create({
    reviewId,
    url
  });

      // Return success response with the created image
  return res.status(201).json({
    id: newImage.id,
    url: newImage.url
  });
});


//* Delete a review

router.delete('/:reviewId', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id; // The authenticated user's id

      // Find the review by id
  const review = await Review.findByPk(reviewId);

      // Error handling: If review is not found, return a 404 error
  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found"
    });
  }

       // Authorization check: Ensure the review belongs to the current user
  if (review.userId !== userId) {
    return res.status(403).json({
      message: 'You are not authorized to delete this review'
    });
  }

        // Delete the review
  await review.destroy();

  // Return success response
  return res.status(200).json({
    message: "Successfully deleted"
  });
});
     

// ***** EXPORTS *****/
module.exports = router;