//npm for validation
const Joi = require('joi');

//for error handling, we expect campground object and inside all info about campground, because if you take a look at our form we define name of inputs like this: name="campground[...]"
module.exports.campgroundSchemaValidation = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // img: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});


module.exports.reviewSchemaValidation = Joi.object({
    review: Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body: Joi.string().required(),
    }).required()
});


