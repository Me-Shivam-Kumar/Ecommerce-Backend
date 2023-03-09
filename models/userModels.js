const mongoose=require("mongoose")
const validator = require("validator");
const bcrypt=require("bcryptjs");
const jwt= require("jsonwebtoken");
const crypto=require("crypto"); 

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter the name"],
        maxlength:[30,"Name should not exceed 30 characters"],
        minLength:[4,"Name should have more than 4 charaters"]  
    },
    email:{
        type:String,
        required:[true,"Please Enter a valid email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a correct email"]
    },
    password:{
        type:String,
        required:[true,"Enter your password"],
        minLength:[8,"Password should be greater than equal to 8"],
        select:false
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date


});
userSchema.pre("save",async function(next){
      if(!this.isModified("password")){
          next();
      }
    this.password=await bcrypt.hash(this.password,10);
});

//JWT TOKEN
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE, 
    })
}
//Compare Password
userSchema.methods.comparePassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}
//Generating Password Reset Token
userSchema.methods.getResetPasswordToken=function(){
    //Generating Token
    const resetToken=crypto.randomBytes(20).toString("hex");

    //Hashing and add to userSchema 
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now()+15*60*1000;

    return resetToken;
}
module.exports = mongoose.model("User",userSchema);