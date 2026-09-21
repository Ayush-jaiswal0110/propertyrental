const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressErr.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.ensureLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash("error", "You must be signed in to view that page.");
      return res.redirect("/login");
    }
    next();
  };
  

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "you must logged in to create listing!");
        return res.redirect("/login");
   }
   next();
};

module.exports.savedRedirectUrl = (req,res,next) =>{
if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
}
next();
};

module.exports.isOwner = require("./utils/wrapAsync")(async(req,res,next) =>{
    let {id} = req.params;
     let listing = await Listing.findById(id);
     if (!listing || !req.user) return res.redirect('/listings');
     if(!listing.owner || !listing.owner.equals(req.user._id)){
        req.flash("error", "You are not the owner of this Listing");
        return res.redirect(`/listings/${id}`);
     }
     next();
});

module.exports.validateListing = (req,res,next) =>{
    const result =  listingSchema.validate(req.body);
    if(result.error){
        let errMessg = result.error.details.map((el)=>el.message).join(",");
        throw new ExpressError(errMessg,404);
    }else{
            next();
    }
};

module.exports.validateReview = (req,res,next) =>{
    const result =  reviewSchema.validate(req.body);
    if(result.error){
        let errMessg = result.error.details.map((el)=>el.message).join(",");
        throw new ExpressError(errMessg,404);
    }else{
            next();
    }
};

module.exports.isReviewAuthor = require("./utils/wrapAsync")(async(req,res,next) =>{
    let {id,reviewId} = req.params;

     let review = await Review.findById(reviewId);
     if (!review || !req.user) return res.redirect('/listings/'+id);
     if(!review.author || !review.author.equals(req.user._id)){
        req.flash("error", "You are not the author of this Review");
        return res.redirect(`/listings/${id}`);
     }
     next();
});