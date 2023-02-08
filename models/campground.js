const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

//if we use a NameOfSchema.virtual() -> we are giving the object virtual property which the object will hold but will not store in DB
//but if you print the object you will see that object is not holding the property inside, this line of code tells the object to hold that property, but still will not be saved in DB (that property, object will be)
const opts = {toJSON: {virtuals: true}};

const ImageSchema = new Schema({
    url: String,
    filename:String
})
//the cloudinary have and option to pass width of img in url and then render image based on that
//this is how url of one of my images look like if you open them on cloudinary -> https://res.cloudinary.com/dclry9bpj/image/upload/v1673963353/YelpCamp/wthskgwgkg7ubcgpamft.png
//so every time we call thumbnail(in edit template) we replace /upload to /upload/w_300 in url of image
ImageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload', '/upload/w_300');
})

//if you look at geometry, what we store inside is a geoJSON, and this type of JSON have to always look the same (I mean the schema of it)
//type will always be a Pointer and coordinates are latitude and landitute (2 numbers)
const CampgroundSchema = new Schema({
    title: String,
    img: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
}, opts);

//this middleware is for MapBox to show the info in PopUp when you click on campground on map in index.js
CampgroundSchema.virtual('properties.popUpMarkup').get(function (){
    return `<a href="/campgrounds/${this._id}">${this.title}</a> <p>${this.description.substring(0, 150)}...</p>`;
})

//mongoose middleware
//check docs for .post() and .pre() middleware function
//whenever you delete a campground, delete also all reviews that belongs to that campground
CampgroundSchema.post('findOneAndDelete', async function(campground){
    if (campground.reviews.length){
        const res = await Review.deleteMany({_id: {$in: campground.reviews}});
        console.log(res);
    }})

module.exports = mongoose.model('Campground', CampgroundSchema);