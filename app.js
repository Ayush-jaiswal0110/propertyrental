if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
require("./init/passport"); // Ensure Passport strategies are configured
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbUrl = process.env.ATLASDB_URL;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErr.js")
const Listing = require("./models/listing.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const reviewRouter = require("./routes/review.js");


main().then(()=>{
    console.log("connect to db");
}).catch((err)=>{
    console.error("Database connection failed:", err.name);
})
async function main(){
    await mongoose.connect(dbUrl); //dbUrl for atlas db 
}

// app.get("/",(req,res)=>{
//     res.send("hii i am root");
// })

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

// A database-independent reference page for checking the assignment design.
app.get("/design-reference", (req, res) => {
    const listing = require("./init/referenceListing");
    res.render("listings/show", {
        listing, presentation: require("./utils/listingPresentation")(listing),
        isReference: true, currUser: null, success: [], error: [], nearbyListings: require('./init/data').data.slice(0,8).map(item=>({...item,href:'/listings?location='+encodeURIComponent(item.location)}))
    });
});

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24*3600,
});
store.on("error", (err) => {
    console.error("Session store unavailable:", err.name);
})
const sessionOptions = {
    store,
    secret :  process.env.SECRET,
    resave : false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true, //cross sceripting attach 
    },
};


//initilize the seesion to store the session info as cookiees on the browsser
app.use(session(sessionOptions));
// use flash to display the message once 
app.use(flash()); 

//initize the passport for user authentication and authorization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // use the static authenticate method of model  in localStratagy
//use static serialize and deserilize of moodle for passport session support 
passport.serializeUser(User.serializeUser()); // serialize means to store the user info in the seesion 
passport.deserializeUser(User.deserializeUser());// deserialize user means to remove the user info from the session 

//middileware to use the flash 
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.oauthProviders = {google:!!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),facebook:!!(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET)};
    next();
});
const bookingRoutes = require("./routes/booking");
app.use("/bookings", bookingRoutes);

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
// error handling

app.get("/", (req, res) => {
    res.render("home");
});

app.all("*",(req,res,next)=>{
    next(new ExpressError("Page Not Found!",404));
});


app.use((err,req,res,next)=>{
    const  {statusCode = 500 , message = "something went wrong"} = err;
    // res.status(statusCode).send(message);
    if (res.headersSent) {
        // If headers are already sent, avoid sending another response
        return next(err);
    }
    res.status(statusCode).render("error.ejs",{statusCode,message});
});



const port = Number(process.env.PORT || 8080);
app.listen(port, ()=>{
    console.log("Property Rental is listening on port " + port);
});
