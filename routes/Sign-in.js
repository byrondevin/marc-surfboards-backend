//---------------------IMPORTS---------------------
import express from "express";
import methodOverride from 'method-override';
import User from  '../modules/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {fileURLToPath} from 'url';
import path from "path";




//---------------------CONFIGURATION, ETC.---------------------
const router = express.Router();


const __filename = fileURLToPath(import.meta.url);

// Configuring the dotenv file that holds the secret keyss
dotenv.config();

//Assign express to 'app' variable 
const app = express();




//---------------------MIDDLEWARE--------------------
//allows to make put, delete, etc. requests from html body, disguising as post
app.use(methodOverride('_method') );

//allows to read json objets send in request body
app.use(express.json());

//gives access to request body
app.use(express.urlencoded({extended:true}));




//---------------------ROUTES--------------------

//LOG IN
//get route logs user into db. JWT authentication. bcrypt to encode user info. Async so can await db fetch
router.post("/", async (req, res) => {


    // Try find username entered
    try{

        //mongoose request to db to find username enteres
        const user = await User.findOne({email: req.body.email});

       
        //if user not found, print and return the message that the username isnt found
        if (user ==null){

            console.log('cannot find username entered');
            return res.status(400).send('cannot find username entered');

        }

        //try comparing passwords. decrypting with bcrypt
        try{

            // bcrypt compare function
            if(await bcrypt.compare(req.body.password, user.password[0])){

                    //create Json object with username and access. This sent with token
                    const payload = {
                        'email': user.email, 
                        'admin': user.admin
                    }

                   //Try creating JSON Token. If successfull, return as key-value pair
                    try {

                        const token = jwt.sign(

                            JSON.stringify(payload), 
                            process.env.ACCESS_TOKEN_SECRET

                        )

                        //return JWT token
                        res.json({'token': token})

                    } 
                    //Catch errors relating to Token creation and sending
                    catch (e) {

                        console.log("JWT Sign failed")
                        console.log(e)
                        
                    }
           
            }
            //else triggered if decrypted passwords dont match, but comparison was successfull
            else{

                    console.log("password didnt match");
                    res.status(403).send({'err': 'incorrect login'});

            }
                
        } 
        //catches errors related to bcrypt compare
        catch(e){

                console.log("bcrypt compare failed");
                return res.status(500).send(e);

            }


    }
    //catches any errors from username mongoose find()
    catch(e){

        console.log("ERROR with username findOne that tries to match wmail addrs with user in db");
        console.log(e);
        
    }
    

 });

 export default router;