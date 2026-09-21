const passport = require('passport');
const User = require('../models/user');
const baseURL = process.env.BASE_URL || 'http://localhost:8080';
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  const FacebookStrategy = require('passport-facebook').Strategy;
  passport.use(new FacebookStrategy({
    clientID:process.env.FACEBOOK_APP_ID,clientSecret:process.env.FACEBOOK_APP_SECRET,
    callbackURL:process.env.FACEBOOK_CALLBACK_URL || baseURL + '/auth/facebook/callback',
    profileFields:['id','displayName','emails'],
  }, async (accessToken,refreshToken,profile,done)=>{
    try {
      let user=await User.findOne({facebookId:profile.id});
      if(!user)user=await User.create({username:profile.displayName || 'Facebook User',email:profile.emails?.[0]?.value || '',facebookId:profile.id});
      done(null,user);
    } catch(error){done(error);}
  }));
}
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const GoogleStrategy=require('passport-google-oauth20').Strategy;
  passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL || baseURL + '/auth/google/callback',
  }, async (accessToken,refreshToken,profile,done)=>{
    try {
      let user=await User.findOne({googleId:profile.id});
      if(!user)user=await User.create({username:profile.displayName || 'Google User',email:profile.emails?.[0]?.value || '',googleId:profile.id});
      done(null,user);
    } catch(error){done(error);}
  }));
}
