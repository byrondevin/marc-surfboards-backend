//Defining Enquiry collection on DB


//Imports
import mongoose from "mongoose";


//Enquiry Schema definition
const enquirySchema = new mongoose.Schema({

    //name of person enquiring
    name:{
        type: String
    },

    //enquirer's email address
    email:{
        type: String,
        required: [true, "Email address required"],
        lowercase:true,
        required: [true, "Email required"],
    },

    //type of custom board wanted
    board:{
        type:String,
    },

    //message including additional details
    message:{
        type: String
    }

})


//creating a mongoose model with the above-defined schema
const Enquiry = mongoose.model('Enquiry',enquirySchema);


//Exporting Enquiry mongoose model
export default Enquiry;
