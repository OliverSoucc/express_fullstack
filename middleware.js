const {campgroundSchemaValidation, reviewSchemaValidation} = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.validateCampground = (req, res, next) => {
    //Joi have key error, when we submit form under this key will be an object that tells us if request passed the validation and if not then it will tell us what went wrong in validation process
    const {error} = campgroundSchemaValidation.validate(req.body);
    if (error) {
        //we map it to make single string message from array
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) =>{
    //Joi have key error, when we submit form under this key will be object that tells us if request passed the validation and if not then it will tell us what went wrong in validation process
    const {error} = reviewSchemaValidation.validate(req.body);
    if (error){
        //we map it to make single string message from array
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
};

module.exports.isLoggedIn = (req, res, next) =>{
    if (!req.isAuthenticated()){
        //motivation is, if you try to access something that you need to by signed, this will redirect to you to login, when you logged in it will redirect you to (in post route('/login')) always to '/campgrounds'
        //but we want you to redirect to page that you tried to access before you signed in
        //so we store in session the URL(req.originalUrl) you tried to access and then in routes -> users.js -> post('/login') we redirect you to page that you tried to access
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params
    const campground = await Campground.findById(id);
    //here we are preventing to manipulate with the campground from user that do not create this campground (even though if you are not the user that created this campground, you will not even see the edit/delete button, but theoretically you can update it with Postman)
    if (!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

//this is used in reviews delete route, if you check it you will see that route is /campgrounds/:id/reviews/:reviewId, so we have access to both Ids
module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params
    const review = await Review.findById(reviewId);
    //here we are preventing to manipulate with the campground from user that do not create this campground (even though if you are not the user that created this campground, you will not even see the edit/delete button, but theoretically you can update it with Postman)
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};