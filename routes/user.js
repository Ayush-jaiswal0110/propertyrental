const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const {getSignUp, postSingnUp, getLogin, postLogin, logout} = require("../controllers/users.js");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { ensureLoggedIn } = require("../middleware");
const Booking = require("../models/booking");

// get post route for signup 
router
  .route("/signup")
  .get( getSignUp)
  .post( 
    wrapAsync(postSingnUp)
    )

// get post route for login 
router
  .route("/login")
  .get( getLogin)
  .post(
    savedRedirectUrl,
     passport.authenticate('local',{
        failureRedirect: '/login' , 
        failureFlash: true
        }), 
        postLogin
    )


//logout GET route 
 router.get("/logout", logout);
 

 function providerEnabled(provider) {
  return (req,res,next) => {
    const configured=provider==='google' ? process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET : process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET;
    if(configured)return next();
    req.flash('error','This sign-in provider is not configured. Please use your username and password.');
    res.redirect('/login');
  };
}

// Google Authentication
router.get(
  "/auth/google",
  providerEnabled("google"),
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  providerEnabled("google"),
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/signup",
  })
);

// Facebook Authentication
router.get(
  "/auth/facebook",
  providerEnabled("facebook"),
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/auth/facebook/callback",
  providerEnabled("facebook"),
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/signup",
  })
);

// Profile Route
// Profile Route
router.get(
  "/profile",
  ensureLoggedIn, // Middleware to check if the user is logged in
  wrapAsync(async (req, res) => {
    const userId = req.user._id;

    // Fetch listings created by the user
    const userListings = await Listing.find({ owner: userId });

    // Fetch reviews created by the user and populate the associated listing
    const userReviews = await Review.find({ author: userId }).populate("listing");

    // ✅ Fetch bookings made by the user and populate listing details
    const userBookings = await Booking.find({ user: userId }).populate("listing");

    res.render("users/profile", {
      userListings,
      userReviews,
      userBookings, // Pass bookings to the view
      user: req.user
    });
  })
);

// Admin View: Owner can see all bookings for their listings
router.get(
  "/owner/bookings",
  ensureLoggedIn,
  wrapAsync(async (req, res) => {
    const ownerId = req.user._id;

    // Get all listings owned by the current user
    const ownedListings = await Listing.find({ owner: ownerId });

    // Get all bookings related to those listings
    const bookings = await Booking.find({ listing: { $in: ownedListings.map(listing => listing._id) } })
                                  .populate("listing")
                                  .populate("user"); // So you can see who booked

    res.render("users/ownerBookings", { bookings });
  })
);



module.exports = router;