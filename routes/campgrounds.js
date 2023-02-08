const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campgrounds = require('../controllers/campgrounds');
const multer  = require('multer');
const {storage} = require('../cloudinary');
//here we are telling to multer to store on cloudinary, and not locally in some folder
const upload = multer({ storage });
//custom middlewares
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

//faster way to create routes, in app.js we define prefix /campground, so here are the routes for /campground
router.route('/')
    .get(catchAsync(campgrounds.index))
    //validateCampground should be before upload.array('image'), fix later
    //string parameter (image) should be the same as name of input -> name="image"
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

//we have putted this function before '/campgrounds/:id' because if we would not do that what the browser would treat '/new' as '/:id'
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

//here are the routes for /campground/:id
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'),validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;