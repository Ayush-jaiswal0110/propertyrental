const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
// index route
module.exports.index = async (req, res) => {
  const { location } = req.query;
  let allListings;

  if (location) {
    // Use case-insensitive search
    allListings = await Listing.find({ location: new RegExp(location, 'i') });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index", { allListings });
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
      res.redirect("/listings");
    }
    res.render("listings/show",{listing,
         mapToken: process.env.MAP_TOKEN
    });
}

// create listing rout function 
module.exports.create= async (req, res , next) => {
    //Geocoding 
   let response = await  geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
    }).send();

     // geting image path 
     let url = req.file.path;
     let filename = req.file.filename;
     console.log(url ,"..", filename);
     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     newListing.image = {url,filename}; // save image url and filname to database 
     newListing.geometry = response.body.features[0].geometry; // store the coordinates from the mapbox geocoding
     let savedListng = await newListing.save();
     console.log(savedListng);
     req.flash("success","New Listing Created");
     res.redirect("/listings");  
 };

//edit route funnction 
module.exports.edit=async(req,res)=>{
     let {id} = req.params;
     const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you are requested does not exist");
        res.redirect("/listings");
      }
      let originalImage = listing.image.url;
      originalImage = originalImage.replace("/upload","/upload/h_300,w_250/e_blur:300")
     res.render("listings/edit",{listing , originalImage});
 };

//update route 
module.exports.update = async(req,res)=>{
     let {id} = req.params;
     let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
     if(typeof req.file !== "undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     listing.image = {url,filename};
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


