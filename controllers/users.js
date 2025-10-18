const User = require("../models/user");
const Listing= require("../models/listing")

//  Render Signup Form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

//  Signup Logic
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Airbind!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//  Render Login Form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// Login Logic
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to Airbind, Successfully Logged In!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};



// Logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};


//search
// module.exports.searching= async (req,res)=>{
//   const searchterm = req.query.q;

//   try{
//         //  Database me search karo title ke andar, case-insensitive
//     const listings = await Listing.find({
//       title: { $regex: searchterm, $options: 'i' }
//     }) 
//     res.render("includes/navbar.ejs",{listings,searchterm})
//   }
  
//   catch(error){
//  console.log(error)
//  res.send("searchin error")
//   }

// }