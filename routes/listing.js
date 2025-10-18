const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js")

//multipart/form-data ko manuplate karna ka liya 1
const multer = require('multer')
const {storage}= require("../cloudConfig.js")
const upload = multer({storage})




// Index Route and creat listing
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
  
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.creatListing)
  );





// New Route
router.get("/new", isLoggedIn,listingController.renderNewForm);

//update Route
router .route("/:id")
  .get(wrapAsync(listingController.showRoute))

  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateRoute)
  )

  // Delete particular listing (DELETE)
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyRoute)
  );


// Edit Route
router.get(
  "/:id/edit",
   isLoggedIn,
  isOwner,
  wrapAsync(listingController.editRoute)
);



// // Show Route
// router.get(
//   "/:id",
//   wrapAsync(listingController.showRoute)

  
// );

// // Update Route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.updateRoute)
// );



// // Delete Route
// router.delete(
//   "/:id", isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.destroyRoute)
// );

module.exports = router;
