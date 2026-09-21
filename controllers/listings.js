const Listing = require("../models/listing");
const listingPresentation = require("../utils/listingPresentation");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mapToken ? mbxGeocoding({ accessToken: mapToken }) : null;
// index route
module.exports.index = async (req, res) => {
  const location = typeof req.query.location === 'string' ? req.query.location.slice(0,120) : '';
  let allListings;

  if (location) {
    // Use case-insensitive search
    const escaped = location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    allListings = await Listing.find({ location: new RegExp(escaped, 'i') });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index", { allListings, location: location || '' });
};


//Render new form 
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

//show route 
module.exports.show=async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate: {
          path:"author"
      }})
    .populate("owner");
    if(!listing){
      req.flash("error","Listing you are requested does not exist");
      return res.redirect("/listings");
    }
    const nearbyListings = await Listing.find({_id: {$ne: listing._id}, location: listing.location}).limit(5);
    res.render("listings/show",{listing,
         presentation: listingPresentation(listing),
         nearbyListings,
         mapToken: process.env.MAP_TOKEN
    });
}

// create listing rout function 
module.exports.create= async (req, res , next) => {
   if (!req.file) return next(new (require('../utils/ExpressErr'))('Please upload a cover photo.',400));
   if (!geocodingClient) return next(new (require('../utils/ExpressErr'))('Location services are not configured. Please set MAP_TOKEN.',503));
    //Geocoding 
   let response = await  geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
    }).send();

     if (!response.body.features.length) return next(new (require('../utils/ExpressErr'))('Location not found. Try a city and country.',400));
     // geting image path 
     let url = req.file.path;
     let filename = req.file.filename;

     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     newListing.image = {url,filename}; // save image url and filname to database 
     newListing.images = (req.galleryPhotos || []).map(file => ({
       url:file.path, filename:file.filename, room:req.body.galleryRoom || 'Property photos'
     }));
     newListing.geometry = response.body.features[0].geometry; // store the coordinates from the mapbox geocoding
     let savedListng = await newListing.save();

     req.flash("success","New Listing Created");
     res.redirect("/listings");  
 };

//edit route funnction 
module.exports.edit=async(req,res)=>{
     let {id} = req.params;
     const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you are requested does not exist");
        return res.redirect("/listings");
      }
      let originalImage = listing.image.url;
      originalImage = originalImage.replace("/upload","/upload/h_300,w_250/e_blur:300")
     res.render("listings/edit",{listing , originalImage});
 };

//update route 
module.exports.update = async(req,res)=>{
     let {id} = req.params;
     let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new:true,runValidators:true});
     if (!listing) { req.flash('error','Property not found'); return res.redirect('/listings'); }
     if(typeof req.file !== "undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     listing.image = {url,filename};
     await listing.save();
     }
     if (req.galleryPhotos?.length) {
       listing.images.push(...req.galleryPhotos.map(file => ({
         url:file.path, filename:file.filename, room:req.body.galleryRoom || 'Property photos'
       })));
       await listing.save();
     }
     req.flash("success","Listing Updated");
     res.redirect(`/listings/${id}`);
 };

 //delete route 
 module.exports.deleteList = async(req,res)=>{
    let {id} = req.params;
    const deletedListing =  await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
};


