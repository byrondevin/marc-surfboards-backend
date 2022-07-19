//Imports
import mongoose from "mongoose";
import User from  '../modules/user.js';


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