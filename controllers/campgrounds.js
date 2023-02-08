const Campground = require("../models/campground");
const {cloudinary} = require('../cloudinary');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
    //here we store geoJSON from Mapbox API
    const geoData = await geocoder.forwardGeocode({query: req.body.campground.location, limit: 1}).send();
    const {campground} = req.body;
    const newCampground = new Campground(campground);
    //here we set geometry attribute to data from Mapbox
    newCampground.geometry = geoData.body.features[0].geometry;
    //here thanks to cloudinary and multer we have access to req.files, here we loop over the images and store their url and filename into DB
    newCampground.img = req.files.map(file => ({url: file.path, filename: file.filename}));
    //this is how you access the current user in backend (not in templates)
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
        //this is nested populating, on Campground we want to populate reviews and then in each review we want to populate review author, then we populate Campground author
        .populate({path: 'reviews', populate: {path: 'author'}})
        .populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that camground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground});
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that camground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    //when you take a look on edit.ejs template, in all inputs in name attribute we use: campground[...], so in option parameter of findOneAndDelete function we just spread that object
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    //here thanks to cloudinary and multer we have access to req.files, here we loop over the images and store their url and filename into DB
    //we save array into variable and then on next line we spread elements into existing img array
    const imgs = req.files.map(file => ({url: file.path, filename: file.filename}))
    campground.img.push(...imgs);
    await campground.save();
    if (req.body.deleteImages){
        //here we are deleting images from cloudinary
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        //here we are deleting images from DB
        //explanation: pull out from img array all objects that have filename in req.body.deleteImages(array) -> name="deleteImages[]"
        await campground.updateOne({$pull: {img: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Created new campground')
    res.redirect('/campgrounds/');
}