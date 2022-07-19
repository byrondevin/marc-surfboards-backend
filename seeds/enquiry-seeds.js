//Imports
import mongoose from "mongoose";
import Enquiry from  '../modules/enquiry.js';

//connect to atlas db
mongoose.connect(
    "mongodb+srv://marcsurfboards:twinnyforspeed@marc-surfboards.vultup4.mongodb.net/userDB_Enquiry?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("connected to database myDb ;)");
    }
  );


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