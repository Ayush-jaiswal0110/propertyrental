const User = require("../models/user.js");


// get route for signup 
module.exports.getSignUp =  (req,res) => {
    res.render("users/signup.ejs");
}

//post route for signup 
module.exports.postSingnUp = async (req,res) => {
    try{
    let {username, email, password} = req.body;
    const newUser = new User({email,username});
    const registerdUser = await User.register(newUser,password);
    req.login(registerdUser, (err) =>{
        if(err){
            return next();
        }
        req.flash("success","Welcome to Property-Rental");
        res.redirect("/listings");
    })
   
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
};

// get login 
module.exports.getLogin =(req,res) => {
    res.render("users/login.ejs");
};

// post login 
module.exports.postLogin =  async(req,res) => {
    req.flash("success", "Welcome back to Property-Rental! You are loggeg in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

//logout
module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "your are logged out!");
        res.redirect("/listings");
    })
 };

