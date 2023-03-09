const mongoose=require("mongoose")
const productSchema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"],
        trim:true
    },
    description:{
        type:String, 
        required:[true,"Please enter product description"]
    },
    price:{
        type:Number,
        required:[true,"PLease Enter product Price"],
        maxLength:[8,"Price cannot exceed 8 characters"]
    },
    
    category:{
        type:String,
        required:[true,"Please Enter Product Category"]
    },
    rating:{
        type:Number,
        default:0
    },
    stock:{
        type:Number,
        required:[true,"Enter the stock of this product"],
        default:1,
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            }
            ,
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})
module.exports=mongoose.model("Product",productSchema);