import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email address required"],
        lowercase:true,
        unique:[true, "An account has already created using this email address. Please register with another email address"]
    },
    password:{
        type:[String],
        required: [true, "Password required"]
    },
    admin:{
        type: Boolean,
        default:false
    }

})

const User = mongoose.model('User',userSchema);

export default User;
