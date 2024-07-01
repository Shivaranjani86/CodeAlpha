const { name } = require("ejs");
const mongoose=require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/evrs");

connect.then(()=>{
    console.log(`Database connected Successfully`);
})
.catch(()=>{
    console.log("Database can't be connected");
});

const registerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    }
});

const Register = new mongoose.model("registeration",registerSchema);
module.exports = Register;

