const express = require('express');
const path = require('path');
const cities = require('./cities');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console,"connection error"));
db.once('open',()=>{
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const randomPrice = Math.floor(Math.random()*100)
        const camp = new Campground({
            author:'660994dc1ce294cee86b7193',
            title:`${sample(descriptors)} ${sample(places)}`,
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            images:[
                {
                  url: 'https://res.cloudinary.com/dxrufqlx1/image/upload/v1712399679/YelpCamp/ihx0bajxq5howuftt4mt.jpg',
                  filename: 'YelpCamp/ihx0bajxq5howuftt4mt'
                }
              ],
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, suscipit ab facere quaerat hic nam ut. Hic ratione accusamus enim aliquid illo ea fugiat laboriosam! Fuga assumenda ipsum maxime nihil",
            price: randomPrice
        })
        await camp.save();
    }
    
}

seedDB().then(()=>{
    mongoose.connection.close();
})