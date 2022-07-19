//---------------------IMPORTS--------------------
import express from "express";
import mongoose from "mongoose";
import methodOverride from 'method-override';
import User from  './modules/user.js';
import Enquiry from  './modules/enquiry.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {fileURLToPath} from 'url';
import path from "path";
import cors from "cors";





//---------------------CONFIGURATION, ETC.---------------------
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Configuring the dotenv file that holds the secret keyss
dotenv.config();

//Assign express to 'app' variable 
const app = express();

//Getting app to listen for requests on port 5000
const PORT = process.env.port || 5000;





//---------------------MIDDLEWARE--------------------
//allows to make put, delete, etc. requests from html body, disguising as post
// app.use(methodOverride('_method') );

//allows to read json objets send in request body
app.use(express.json());

//gives access to request body
app.use(express.urlencoded({extended:true}));

//CORS allowing cross origin requests
app.use(cors({
    origin: ["https://illustrious-pavlova-ad9c7d.netlify.app", "http://localhost"]
}))





//---------------------DB CONNECT--------------------
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





//---------------------ROUTE IMPORTS AND ALLOCATIONS--------------------

//Sign-in
import signInRoute from './routes/Sign-in.js';
app.use('/sign-in', signInRoute);

//Sign-up
import signUpRoute from './routes/Sign-up.js';
app.use('/sign-up', signUpRoute);

//Enquiry
import enquiryRoute from './routes/Enquiry.js';
app.use('/enquiry', enquiryRoute);

//Users
import usersRoute from './routes/Users.js';
app.use('/users', usersRoute);

//UsersDel
import usersDelRoute from './routes/Usersdel.js';
app.use('/usersdel', usersDelRoute);





//--------------------- AUTHENTICATE ADMIN USER MIFDDLEWARE//---------------------
//Can be used to authenticate a user before making a request. 
function authenticateToken(req, res, next){

    //Getting JWT token from request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (token == null) {
        console.log("TOKEN == NULL");
        return res.sendStatus(401);
    }

    //verifying JWT token taken from request header. 
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        
        //if the JWT verification responds with an error, print and send the error
        if (err){
            console.log("ERROR: JWT VERIFICATION ")
            return res.sendStatus(403);
        }

        req.user = user;

        //if the JWT verification is successfull and has admin access, move onto next function
        if(user.admin === true){
            next();
        }else{
            console.log("ERROR: NO ADMIN ACCESS ");
            return res.sendStatus(403);
        }
    })
 }

 



//---------------------PRODUCTION (LIVE SITE) BUILD SETTINGS---------------------
//procution =live site
//if project is in production, display frontend resurces
if (process.env.NODE_ENV === 'production'){ 
    app.use(express.static(path.join(__dirname, 'frontend/build')));
        //catches all get endpoints/routes besides the routes defined above this in the doc. responds with landing page
        app.get('*',(req,res)=> {
            res.sendFile(path.resolve(__dirname, 'frontend', 'build','index.html'));
        });
}





//---------------------LISTENING EXPRESS SERVER---------------------
app.listen(process.env.PORT || 5000, () => {

    console.log("listening on PORT 5000");

})
