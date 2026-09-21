const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const { index, renderNewForm, show, create, edit, update, deleteList } = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({
  storage, limits:{fileSize:10*1024*1024,files:44},
  fileFilter(req,file,callback) {
    if (!['image/jpeg','image/png','image/webp'].includes(file.mimetype)) return callback(new (require('../utils/ExpressErr'))('Upload JPEG, PNG or WebP photos.',400));
    callback(null,true);
  }
});
const uploadPhotos = upload.fields([
  {name:'listing[image]',maxCount:1},
  {name:'gallery',maxCount:43},
]);
function normalizePhotos(req,res,next) {
  req.file = req.files?.['listing[image]']?.[0];
  req.galleryPhotos = req.files?.gallery || [];
  next();
}

// create index route 
router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    uploadPhotos,
    normalizePhotos,
    validateListing,
    wrapAsync(create));

// new route 
router.get("/new", isLoggedIn, renderNewForm);

//show delete and update route 
router
  .route("/:id")
  .get(wrapAsync(show))
  .put(
    isLoggedIn,
    isOwner,
    uploadPhotos,
    normalizePhotos,
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
