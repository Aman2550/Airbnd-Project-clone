if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
 
}
// console.

// console.log(process.env.SECRET)
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session")
const MongoStore = require('connect-mongo')
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const {isLoggedIn} = require("./middleware.js")
const listingsRouter = require("./routes/listing.js")
const reviewsRouter  = require("./routes/review.js")
const userRouter  = require("./routes/user.js")






// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

//Acess of file and package
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

const store = MongoStore.create({
  mongoUrl: dbUrl, // tera MongoDB URL
  crypto: {
    secret:  process.env.SECRET, // session encrypt karne ke liye
  },
  touchAfter: 24 * 3600 // 24 hours
});

// Error handling
store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE:", err);
});


const sessionOptions ={
  store,
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized : true,
  cookie:{
    expires: Date.now() +7 * 24 * 60 * 60 * 1000,
    maxAge: +7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  }
}

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });



app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
//mehtod
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//creat new listing alert
app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user;
  next()
})

// app.get("/demouser", async (req,res)=>{
//   let fakeuser= new User({
//     email: "Student@gmail.com",
//     username:  "delta-student",
//   })
//   let registeredUser = await User.register(fakeuser, "NewStudent")
//   res.send(registeredUser)
// })

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews" , reviewsRouter)
app.use("/",userRouter)

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req,res, next)=>{
  let {statusCode =500, message = "Somthing is wrong!"}=err;
 res.status(statusCode).render("error.ejs",{message})
})

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});


// Authentication 
// Authentication is the process of verifying who someone is 

//Aithorization
//Authorization is the process of verifiying what specification applications
// , files and data a user has  access to

//Storing Passwords
// We never store the password as it is.we store their hashed from 

//Hashing
//What we need to know-
//for every input ,there is a fixed output
// they are one-way function , we can't get input from output
// for a different input , ther is a diffrenet output but ofdame length
// small changed in input should bring lage chnges in output


//Salting
//Password salting is a technique to protect password stored in database by adding a
//strig of 32 or more characters and then hashing them.