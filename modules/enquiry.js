import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String,
        required: [true, "Email address required"],
        lowercase:true,
        required: [true, "Email required"],
    },
    board:{
        type:String,
    },
    message:{
        type: String
    }

})

const Enquiry = mongoose.model('Enquiry',enquirySchema);

export default Enquiry;
