//---------------------IMPORTS---------------------
import express from "express";
import methodOverride from "method-override";
import User from "../modules/user.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import { fileURLToPath } from "url";
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
app.use(methodOverride("_method"));

//allows to read json objets send in request body
app.use(express.json());

//gives access to request body
app.use(express.urlencoded({ extended: true }));

//AUTHENTICATE ADMIN USER MIFDDLEWARE. Can be used to authenticate a user before making a request.
function authenticateToken(req, res, next) {


  //Getting JWT token from request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {

    console.log("TOKEN == NULL");
    return res.sendStatus(401);

  }


  //verifying JWT token taken from request header.
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

    //if the JWT verification responds with an error, print and send the error
    if (err) {

      console.log("ERROR: JWT VERIFICATION ");
      return res.sendStatus(403);

    }

    //if the JWT verification is successfull and has admin access, move onto next function
    req.user = user;
    if (user.admin === true) {

      next();

    } else {

      console.log("ERROR: NO ADMIN ACCESS ");
      return res.sendStatus(403);

    }
  });
}



//DISPLAY ALL
router.get("/", authenticateToken, async (req, res) => {

  //get all users from db
  const users = await User.find({});

  // respond with list of users as a json object
  res.status(200).json({ users: users });

});




//EDIT USER
router.put("/", async (req, res) => {

  //retrieving data from req.body
  let body = req.body;
  let id = req.body.userId;


  // bcrypt hashing
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.userPW, salt);
  

  //use id to find user to update in db. update using form values and adminValue
  const product = await User.findByIdAndUpdate(

    //ID of the product to find
    id,

    //new product details
    {
      email: req.body.userEmail,
      password: hashedPassword,
      admin: req.body.userAdmin,
    },

    //run validation and return new object
    { runValidators: true, new: true }
  );

  //respond wit status 200 and json object including the updated product data
  res.status(200).json({updatedProduct: product});
});



export default router;
