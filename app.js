if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbUrl = process.env.ATLASDB_URL;
const MONGO_URL= dbUrl;
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
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
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

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24*3600,
});
store.on("error", () => {
    console.log("Error in MONGO SESSION store ",err)
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
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
// error handling

app.get("/", (req, res) => {
    res.render("home", { currUser: req.user });
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

app.listen(8080, ()=>{
    console.log("server is listeninig on 8080 port");
});
