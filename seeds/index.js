const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers')

//MONGO
main().catch(err => console.log(`Mongo CANNOT START: ${err}`));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp').then(() => {
        console.log('MONGO Connected')
    });
}
////////////////////////


const seedDB = async () =>{
    await Campground.deleteMany();
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //username: jaro, password: jaro
            author: '63c2e39ac278dd55ae5921f8',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            img: [
                {
                    url: 'https://res.cloudinary.com/dclry9bpj/image/upload/v1673956957/YelpCamp/ptdm7wtjb1aemayn0ixi.jpg',
                    filename: 'YelpCamp/ptdm7wtjb1aemayn0ixi',
                },
                {
                    url: 'https://res.cloudinary.com/dclry9bpj/image/upload/v1673956957/YelpCamp/xopublcudkefsodymtyk.jpg',
                    filename: 'YelpCamp/xopublcudkefsodymtyk',
                }
            ],
            geometry:  { type: 'Point', coordinates: [ cities[random1000].longitude, cities[random1000].latitude ] },
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda deserunt dolorem doloribus dolorum eaque, ex fuga recusandae rem. Aperiam atque culpa inventore ipsa itaque, laboriosam obcaecati odit quae tempore ut.',
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() =>{
    mongoose.connection.close();
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
