const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const { index, renderNewForm, show, create, edit, update, deleteList } = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// create index route 
router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(create));

// new route 
router.get("/new", isLoggedIn, renderNewForm);

//show delete and update route 
router
  .route("/:id")
  .get(wrapAsync(show))
  .put(
    isOwner,
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(update))
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(deleteList));
 
// edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync( edit));
    
module.exports = router;