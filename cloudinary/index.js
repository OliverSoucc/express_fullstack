
/*
to sumarize whole img proccess
1. we choose from local images witch one/s we want to upload
2. we used const multer  = require('multer'); to parse the body in form (check new campground) to be able to send info about file
3. the parsed file contains much info, but we are interested just in url and filename, those 2 information we store in DB
4. we are saving the files in cloudinary where I created a free account and in show template we are using url to display the image/s from cloudinary
note: I do not have notes to this topic on Notion, for more info watch again Section 54 (531-536) of Colt tutorial
 */




//npm for storing files on Cloud -> https://cloudinary.com/console/c-d10b958a1e189bbec845561e180b69
//in DB we have just store some credentials about img
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    //accessing environment variables form .env, I have those credential from my cloudinary account
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        //this will save the photo on cloudinary under YelpCamp folder
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}
