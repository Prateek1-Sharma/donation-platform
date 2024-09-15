const jwt=require("jsonwebtoken");
const User=require("../models/user");

const organisationAuth=async(req,res,next)=>{ 
    const token=req.header("Authorization");
    const organisation=jwt.verify(token,"Prateek");
    // console.log("hello this is JWT Token",user);
    console.log("TOKEN USER ID",organisation.userId);
    req.userId = organisation.userId;//the rq.userId is the carrier and you can fetch the same in controller function , you are giving the value of organisation.userid to req .userid
    // req.user=res;
    next();
};

    module.exports=organisationAuth