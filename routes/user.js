const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const {getSignUp, postSingnUp, getLogin, postLogin, logout} = require("../controllers/users.js");

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
 
module.exports = router;

