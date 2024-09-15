const User=require("../models/user");
const Expense=require("../models/expense")
const Order=require("../models/orders")
const Donation=require("../models/donation")
const sequelize=require("sequelize");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Razorpay = require("razorpay");
const AWS=require('aws-sdk')


exports.buyPrime=async (req, res) => {
    try {
        const donatedAmount=(req.body.donatedAmount)*100;
        const rzp = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        console.log("this is the amount",donatedAmount);
        
        const amount = donatedAmount;

        const order = await rzp.orders.create({ amount, currency: "INR" });
        await Order.create({orderid: order.id, status: "PENDING"})
        // await req.user.createOrder({ orderid: order.id, status: "PENDING" });
        return res.status(201).json({ order, key_id: rzp.key_id, amount});

    } catch (err) {
        console.error(err);
        res.status(403).json({ message: "Something went wrong", error: err });
    }
}

exports.transactionStatus=async(req,res)=>{
    try{
    console.log("transaction-status data",req.body);
    const userId=req.userId;
    console.log("12345",userId);
    
    const {organisationId}=req.body;
   let amount_paid=req.body. amount_paid;
   amount_paid=amount_paid/100;
    const transactionData=await Order.update({paymentid:req.body.payment_id ,status:"SUCCESSFULL"} ,{where:{ orderid: req.body.order_id }});
    const donationDataUpdate=await Donation.create({amount:amount_paid,organisationId:organisationId,userId:userId})
    res.status(202).json({message:"transaction Sucessfull",token:generateJwtToken(userId,undefined,true)})
    }
    catch(err){
      console.log(err);
    }
  }


  function generateJwtToken(userId, userName ,isPremiumUser){
    
    return jwt.sign({userId:userId,userName:userName,isPremiumUser:isPremiumUser},"Prateek")

  }