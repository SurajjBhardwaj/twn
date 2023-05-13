// requiring mongoose for connection
const mongoose = require("mongoose");

const user = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        // required:true
    },
    is_admin:{
        type:Number,
        required:true
    },
    is_varified:{
        type:Number,
        default:0
    },
});

// console.log(userSchema);
const User= mongoose.model("User",user);

module.exports= User;
// module.exports=mongoose.model("User",userSchema);