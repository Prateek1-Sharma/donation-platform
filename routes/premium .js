const express=require("express");
const router=express.Router();
const premiumController=require("../controllers/premium")
const auth=require("../middleware/auth");

router.get("/showLeaderBoard",auth,premiumController.getLeaderBoard)
module.exports=router