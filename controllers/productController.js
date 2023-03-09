const productSchema=require("../models/productModels");
const ErrorHandler=require("../utils/errorHandler");
const catchAsyncError=require("../middleware/catchAsyncErrors");
const ApiFeaures = require("../utils/apiFeatures");
 
//Create Product--Admin
exports.createProduct=catchAsyncError(async (req,res,next)=>{
    req.body.user=req.user.id;
    const product =await productSchema.create(req.body);
    res.status(201).json({
        succes:true,
        product
    });
});
//Get All Product
exports.getAllProduct=catchAsyncError(async(req,res) => {
    const resultPerPage=10;
    const productCount=await productSchema.countDocuments();
    const apiFeature=new ApiFeaures(productSchema.find(),req.query).search().filter().pagination(resultPerPage); //Search Product Based on Keyword
    const products=await apiFeature.query;
    res.status(200).json({
        succes:true,
        products
    });
});
//Update Product --Admin
exports.updateProduct=catchAsyncError(async (req,res,next) =>{
    let product=productSchema.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product Not Found",404))
    }
    product=await productSchema.findByIdAndUpdate(req.params.id,req.body,{new:true,
    runValidators:true,
    useFindAndModify:false  
  })
  res.status(200).json({
    success:true,
    product
  });
});

//Delete Product 
exports.deleteProduct= catchAsyncError(async (req,res,next)=>{
    const product=productSchema.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("Product Not Found",404))
    }
    await product.deleteOne();
    res.status(200).json({
        success:true,
        message:"Product Deleted Successfully"
      });
});
//Get Product Details
exports.getProductDetails=catchAsyncError(async(req,res,next)=>{
    const prduct=productSchema.findById(req.params.id);
    if(!prduct){
        return next(new ErrorHandler("Product Not Found",404));
        }
    
    res.status(200).json({
        success:true,
        prduct,
        
      });
    });
