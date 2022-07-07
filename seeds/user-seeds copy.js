import mongoose from "mongoose";

import User from  '../modules/user.js';



//connect to the marcSurfboards mongo DB
mongoose.connect('mongodb://localhost:27017/marcSurfboards', {
        useNewUrlParser: true, useUnifiedTopology: true
    })
    .then(() => {
        console.log('Successfully connected to marcSurfboards DB');
    })
    .catch(e => {
        console.log('Error in mongoose.connect backend/index.js/');
        console.log(e);
    });


//Create array of Users
const seedUsers = [
    {
        email: "byron@gmail.com",
        password: "byron123",
        admin: true,
    },
    {
        email: "dagny@gmail.com",
        password: "dagny123",
        admin: false,
    },
    {
        email: "gill@gmail.com",
        password: "gill123",
        admin: false,
    },
    {
        email: "gary@gmail.com",
        password: "gary123",
        admin: false,
    },
    {
        email: "pat@gmail.com",
        password: "pat123",
        admin: false,
    }
]

//insert array of Users into userDB
User.insertMany(seedUsers)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })