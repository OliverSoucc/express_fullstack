const Campground = require("../models/campground");
const Review = require("../models/review");


module.exports.createReview = async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    //you can create review only if you are sign in, so req.user._id comes from session cookie, where we store info about sign in user
    review.author = req.user._id;
    //here we are pushing new review into campground reviews array
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) =>{
    const {id, reviewId} = req.params;
    //$pull, basically telling that pull out everything from reviews list (that belongs to founded Campground) under founded reviewId
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Created deleted review')
    res.redirect(`/campgrounds/${id}`);
}