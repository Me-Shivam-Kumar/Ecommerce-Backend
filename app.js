const express=require("express");
const app =express();
const errorMiddleWare=require("./middleware/errors");
const cookieParser=require("cookie-parser");
app.use(express.json())
app.use(cookieParser())
//Router Imports
const product=require("./routes/productRoute");
const user =require("./routes/userRoute");     

app.use("/api/v1",product);
app.use("/api/v1",user);

//Middleeware for error
app.use(errorMiddleWare);

module.exports=app
