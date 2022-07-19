//---------------------IMPORTS---------------------
import express from "express";
import methodOverride from 'method-override';
import User from  '../modules/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {fileURLToPath} from 'url';
import path from "path";




//---------------------CONFIGURATION, ETC.---------------------
const router = express.Router();

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

//AUTHENTICATE ADMIN USER MIFDDLEWARE
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

        //if the JWT verification is successfull and has admin access, move onto next function
        req.user = user;
        if(user.admin === true){

            next();

        }else{

            console.log("ERROR: NO ADMIN ACCESS ");
            return res.sendStatus(403);

        }
    })
 }



//DELETE USER
router.delete("/:id", authenticateToken, async (req,res) =>{
    
    //getting id of item to be deleted. passed in request parameters
    const {id} = req.params;

    //sending delete mongoose request to db to delete said user using id match
    const deletedUser = await User.findByIdAndDelete(id);    

    //return deleted user data
    res.json(deletedUser);

 })


 export default router;