import mongoose from "mongoose";

import Enquiry from  '../modules/enquiry.js';



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
const seedEnquiries = [
    {
        name: "byron",
        email: "byron@gmail.com",
        board: "Shortboard",
        message: "Contact me for further details",
    },
    {
        name: "Rowan",
        email: "rowan@gmail.com",
        board: "Shortboard",
        message: "I want a sicko board",
    },
    {
        name: "Roman",
        email: "roman@gmail.com",
        board: "Funboard",
        message: "Make me surf like Craig Anderson",
    },
    {
        name: "Hayden",
        email: "hmeister@gmail.com",
        board: "Shortboard",
        message: "I haven't fixed my board in  years",
    },
    {
        name: "Reece",
        email: "reece@gmail.com",
        board: "Midlength",
        message: "a twin is a win",
    }
]

//insert array of Users into userDB
Enquiry.insertMany(seedEnquiries)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })