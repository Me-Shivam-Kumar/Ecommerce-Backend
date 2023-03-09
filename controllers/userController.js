const ErrorHandler=require("../utils/errorHandler");
const catchAsyncError=require("../middleware/catchAsyncErrors");
const User=require("../models/userModels");
const sendToken=require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail.js")

//Register User
exports.registerUser=catchAsyncError(async (req,res,next)=>{
    const {name,email,password} =req.body;
    const user=await User.create({
        name,email,password
    });
    sendToken(user,201,res);
});

//Login User
exports.loginUser=catchAsyncError(async (req,res,next)=>{
     const {email,password}=req.body;
     
     //Checking id user has given password and email both

     if(!email || !password){
        return next(new ErrorHandler("Please Enter password and email",400))
     }
     const user=await User.findOne({email}).select("+password");
     if(!user){
          return next(new ErrorHandler("Invalid Email or Password",401));
     }
     const isPasswordMatched=user.comparePassword(password);
     if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401));
   }
  sendToken(user,200,res);

});

//Logout User

exports.logout=catchAsyncError((req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logger Out Succesfully"
    })
});

//Forgot Password

exports.forgotPassword=catchAsyncError(async (res,req,next)=>{
    const user=await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    //Get Reset Password Token

    const resetToken=user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/res et/${resetToken}`;

    const message =`Your Password reset Token is :- \n \n ${resetPasswordUrl} \n\n If you have not requested this email
    then, please igonre it`;

    try{
        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recvoery`,
            message
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} succesfully`
        })
    }catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500));
    }
});
//Reset Password 
exports.resetPassword=catchAsyncError(async (req,res,next)=>{
    //Creating token hash
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    });
    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired",400));
    }
    if(req.body.password!=req.body.confirmPassword){
        return next(new ErrorHandler("Password Does'nt Match",400));
    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save({validateBeforeSave:false});
    sendToken(user,200,res);
});