const express=require("express");
const router=express.Router();
const userController=require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/organisation/signup",userController.addOrgansisation)
router.post("/userSignup",userController.addUser)
router.post("/login",userController.loginUser)
router.get("/oranisationList",userController.getOrganisations)
router.get("/donationhistory",auth,userController.getDonationHistory)
module.exports=router