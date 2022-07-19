//---------------------IMPORTS---------------------
import express from "express";
import methodOverride from 'method-override';
import Enquiry from  '../modules/enquiry.js';
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



//AUTHENTICATE ADMIN USER MIFDDLEWARE. Can be used to authenticate a user before making a request. 
function authenticateToken(req, res, next){


    //Getting JWT token from request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    //if no token, print out custom error message and return 401
    if (token == null) {

        console.log("TOKEN == NULL");
        return res.sendStatus(401);

    }


    //verifying JWT token taken from request header. 
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{

        
        //if the JWT verification responds with an error, print and send the error with status 403
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




//---------------------ENQUIRY ROUTES--------------------


// Get all enquiries
router.get("/", authenticateToken, async (req, res) => {

    //get all users from db
    const enquiries = await Enquiry.find({});

    // resong with list of users as a json object
    res.json(enquiries);

 });




// Add Enquiry
router.post("/", async (req, res) => {

    // Try adding new user to db
    try{

        const newEnquiry = new Enquiry({name: req.body.name, email: req.body.email, board: req.body.board, message: req.body.message});
        const enquiry = await newEnquiry.save();
        
        //respond with user varaible, the response from the  function
        res.json(enquiry);

    }
    //Catch, print and send errors relating to the attempt to add new user to d
    catch(e){

        console.log(e);
        res.status(500).send(e);

    }
 });




//DELETE ENQUIRY
router.delete("/:id", authenticateToken, async (req,res) =>{
    
    //getting id of item to be deleted. passed in request parameters
    const {id} = req.params;

    //sending delete mongoose request to db to delete said user using id match
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);    

    //return deleted user data
    res.json(deletedEnquiry);

 })


 export default router;