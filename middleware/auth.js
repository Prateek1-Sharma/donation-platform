const jwt=require("jsonwebtoken");
const User=require("../models/user");

const auth=async(req,res,next)=>{ 
    const token=req.header("Authorization");
    const user=jwt.verify(token,"Prateek");
    // console.log("hello this is JWT Token",user);
    console.log("TOKEN USER ID",user.userId);

    req.userId = user.userId;//the rq.userId is the carrier and you can fetch the same in controller function , you are giving the value of organisation.userid to req .userid
    // req.user=res;
    next();
    // User.findByPk(user.userId).then((res)=>{
    //     console.log("response",res);
    //     req.user=res;
    //     next();
    // })

}

module.exports=auth;
