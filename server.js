const app=require("./app");
const dotenv=require("dotenv");
const connectDatabase=require("./config/database")
//Handling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})
//config
dotenv.config({path:"./config/config.env"})

//Connecting to database
connectDatabase()


const server=app.listen(process.env.PORT,()=>{
    console.log("Server is Working on Http://localhost:${process.env.PORT}");
})


//Unhandled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting Down the Server due to Unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);
    });
});
