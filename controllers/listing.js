const { model } = require("mongoose");
const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



// index route
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }




//new route
  module.exports.renderNewForm= (req, res) => {
    res.render("listings/new.ejs");
  }




//show route
  module.exports.showRoute=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    
    if (!listing) {
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing });
  }



  //Creat route
  module.exports.creatListing=async (req, res, next) => {
    let response = await geocodingClient .forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
    .send();
    console.log

    let url= req.file.path;
    let filename=req.file.filename; 
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename}
    newListing.geometry =response.body.features[0].geometry;

   let savedListng=await newListing.save();
   console.log(savedListng)
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  }



  //Edit Route
  module.exports.editRoute=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    // Cloudinary transformation (resize to height=300, width=250)
    originalImageUrl = originalImageUrl.replace( "/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  };




  //Update Route
  module.exports.updateRoute=async (req, res) => {
    
    const { id } = req.params; 
   let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  //  purana location update kar rha hai
   if (listing.location !== req.body.listing.location) {
    let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    }).send();

    listing.geometry = response.body.features[0].geometry; // Update new coordinates
    listing.location = req.body.listing.location; // Update text location
    await listing.save()
  }

   if(typeof req.file !== "undefined"){
   let url= req.file.path;
   let filename=req.file.filename; 
   listing.image = {url,filename}
   await listing.save()

  }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  }

  //Delete Route
   module.exports.destroyRoute=async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Deleted successfully!");
    res.redirect("/listings");
  }