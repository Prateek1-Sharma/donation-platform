const express=require("express");
const router=express.Router();
const purchaseController=require("../controllers/purchase")
const auth=require("../middleware/auth");

router.post("/buyPremium",purchaseController.buyPrime)
router.post("/updateStatus",auth,purchaseController.transactionStatus)
module.exports=router