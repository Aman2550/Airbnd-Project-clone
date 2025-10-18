const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js")
const reviewController = require("../controllers/review.js")
const review = require("../models/review.js")

// Review Route
// Create Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.postRoute)
);

// Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

  module.exports=router;