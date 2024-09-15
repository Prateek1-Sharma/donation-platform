const express=require("express");
const router=express.Router();
const organisationAuth=require("../middleware/organisationAuth")
const organisationController=require("../controllers/organisation");

router.get("/donorlist",organisationAuth,organisationController.getDonorData);
module.exports=router;