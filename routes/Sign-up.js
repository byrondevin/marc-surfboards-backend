import express from "express";
import methodOverride from 'method-override';
import User from  '../modules/user.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {fileURLToPath} from 'url';
import path from "path";




//---------------------CONFIGURATION, ETC.---------------------
const router = express.Router();

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
app.use(methodOverride('_method') );

//allows to read json objets send in request body
app.use(express.json());

//gives access to request body
app.use(express.urlencoded({extended:true}));


// SIGN UP
//post route /sign-up. adds new user to db. bcrypt to encode user info. Async so can await db fetch
router.post("/", async (req, res) => {

    // Try adding new user to db
    try{
        //bcrypt hashing
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
 
        


        // const newUser = new User({email: req.query.email, password: req.query.password, admin: false});
        const newUser = new User({email: req.body.email, password: hashedPassword, admin: false});
        console.log(newUser);
        const user = await newUser.save();
        console.log(user);
        
        //respond with user varaible, the response from the  function
        res.json(user);
       

    }
    //Catch, print and send errors relating to the attempt to add new user to d
    catch(e){

        console.log(e);
        res.status(500).send(e);

    }
 });
 
 export default router;