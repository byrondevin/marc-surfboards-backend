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
app.use(methodOverride('_method') );

//allows to read json objets send in request body
app.use(express.json());

//gives access to request body
app.use(express.urlencoded({extended:true}));


//---------------------DB CONNECT--------------------
//connect to the marcSurfboards mongo DB
// mongoose.connect('mongodb+srv://test:test@surfboard.obdi5i6.mongodb.net/?retryWrites=true&w=majority', {dbName: "marcsurfboards", useNewUrlParser: true, useUnifiedTopology: true})

// mongoose.connect('mongodb+srv://neil:testcase@surfboard.obdi5i6.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
//     console.log("Connected")
// })
mongoose.connect(
    "mongodb+srv://neil:testcase@surfboard.obdi5i6.mongodb.net/surfBoard?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("connected to database myDb ;)");
    }
  );

//---------------------SIGN UP & LOGIN ROUTES--------------------

// SIGN UP
//post route /sign-up. adds new user to db. bcrypt to encode user info. Async so can await db fetch
app.post("/sign-up", async (req, res) => {

    // Try adding new user to db
    try{
        //bcrypt hashing
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
 
        


        // const newUser = new User({email: req.query.email, password: req.query.password, admin: false});
        const newUser = new User({email: req.body.email, password: hashedPassword, admin: false});
        const user = await newUser.save();
        
        //respond with user varaible, the response from the  function
        res.json(user);
       

    }
    //Catch, print and send errors relating to the attempt to add new user to d
    catch(e){

        console.log(e);
        res.status(500).send(e);

    }
 });



//LOG IN
//get route logs user into db. JWT authentication. bcrypt to encode user info. Async so can await db fetch
app.post("/sign-in", async (req, res) => {


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

                        //
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
                    res.status(403).send({'err': 'incorrect login'})
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



//------- AUTHENTICATE ADMIN USER MIFDDLEWARE. Can be used to authenticate a user before making a request. 
function authenticateToken(req, res, next){

    //------Getting JWT token from request header
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


//---------------------ENQUIRY ROUTES--------------------
// Get all enquiries
//get route

app.get("/enquiry", authenticateToken, async (req, res) => {

    //get all users from db
    const enquiries = await Enquiry.find({});

    // resong with list of users as a json object
    res.json(enquiries);
 });


// Add Enquiry
//post route /enquiry. adds new enquiry to db.  Async so can await db fetch
app.post("/enquiry", async (req, res) => {

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
app.delete("/enquiry/:id", authenticateToken, async (req,res) =>{
    
    //getting id of item to be deleted. passed in request parameters
    const {id} = req.params;

    //sending delete mongoose request to db to delete said user using id match
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);    

    //return deleted user data
    res.json(deletedEnquiry);
 })

//---------------------ADMIN ACCESS USER ROUTES--------------------

//DISPLAY ALL
//Get all users from mongo DB
app.get("/users" , authenticateToken, async(req, res) =>{

    //get all users from db
    const users = await User.find({});

    // respond with list of users as a json object
    // res.send(users);
    res.status(200).json({'users': users});

})

//EDIT USER
// get route logs user into db. JWT authentication. bcrypt to encode user info. Async so can await db fetch
app.put('/users/:id/', authenticateToken, async (req, res) => {

    //Getting id value from params
    const {id}=req.params;

    //make admin value fale by default
    let adminValue = false;
    //if admin checkbox is checked, make admin value true
    if (req.body.adminCheckbox == 'on'){
        adminValue = true;
    }

    //use id to find user to update in db. update using form values and adminValue
    const product = await User.findByIdAndUpdate(
        //ID of the product to find
        id,

        //new product details
        {
            email: req.body.emailEditForm,
            password: req.body.passwordEditForm,
            admin:  adminValue
        },

        //run validation and return new object
        {runValidators:true, new:true}

        );

    //refresh user page to display new vaues
    res.redirect('/users')


})

//DELETE USER
app.delete("/users/:id", authenticateToken, async (req,res) =>{
    
    //getting id of item to be deleted. passed in request parameters
    const {id} = req.params;

    //sending delete mongoose request to db to delete said user using id match
    const deletedUser = await User.findByIdAndDelete(id);    

    //return deleted user data
    res.json(deletedUser);
 })


//procution =live site
//if project is in production, display frontend resurces
if (process.env.NODE_ENV === 'production'){ 
    app.use(express.static(path.join(__dirname, 'frontend/build')));
        //catches all get endpoints/routes besides the routes defined above this in the doc. responds with landing page
        app.get('*',(req,res)=> {
            res.sendFile(path.resolve(__dirname, 'frontend', 'build','index.html'));
        });
}
app.listen(process.env.PORT || 5000, () => {

    console.log("listening on PORT 5000");

})
