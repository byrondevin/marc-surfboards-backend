//Defining User collection on DB


//Imports
import mongoose from "mongoose";


//User Schema definition
const userSchema = new mongoose.Schema({

    //User's email address
    email:{
        type: String,
        required: [true, "Email address required"],
        lowercase:true,
        unique:[true, "An account has already created using this email address. Please register with another email address"]
    },

    //User's password
    password:{
        type:[String],
        required: [true, "Password required"]
    },

    //User's admin status
    admin:{
        type: Boolean,
        default:false
    }

})


//creating a mongoose model with the above-defined schema
const User = mongoose.model('User',userSchema);


//Exporting User mongoose model
export default User;
