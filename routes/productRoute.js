const express=require("express");
const { getAllProduct,createProduct,updateProduct,deleteProduct,getProductDetails } = require("../controllers/productController");
const router=express.Router();
const {isAuntheticatedUser,authorizeRoles}=require("../middleware/auth");

router.route("/products").get(getAllProduct);
router.route("/product/new").post(isAuntheticatedUser,authorizeRoles("admin"),createProduct);
router.route("/product/:id").put(isAuntheticatedUser,authorizeRoles("admin"),updateProduct).delete(isAuntheticatedUser,authorizeRoles("admin"),deleteProduct).get(getProductDetails);

module.exports = router;