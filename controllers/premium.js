const User=require("../models/user");
const Expense=require("../models/expense")
const Order=require("../models/orders")
const sequelize=require("sequelize");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Razorpay = require("razorpay");
const AWS=require('aws-sdk')


exports.getLeaderBoard=async(req,res)=>{
    //   console.log("leaderBoarddata");
    //   const expenses=await Expense.findAll();
    //   const users=await User.findAll();
    //   console.log("expenses data",expenses);
    //   console.log(users);
    //   const expenseDetails={};
    //   const userLeaderBoard=[];
    //   expenses.forEach((expense)=>{
    //     const amount = parseFloat(expense.amount);
    //     if(expenseDetails[expense.userId]){
    //         expenseDetails[expense.userId]=expenseDetails[expense.userId]+expense.amount;
    //     }
    //     else{
    //         expenseDetails[expense.userId]=expense.amount
    //         console.log(expenseDetails[expense.userId]);;
    //     }
    //     console.log(expenseDetails);
    //     // const userLeaderBoard=[];
    // })
    // users.forEach((user)=>{
    //     userLeaderBoard.push({name:user.name,Amount:expenseDetails[user.id] || 0})
    //     console.log(userLeaderBoard);
    // })
    // userLeaderBoard.sort((a,b)=>b.Amount-a.Amount)
    // res.status(200).json(userLeaderBoard);
    
    const leaderBoard=await User.findAll({
      attributes:["id","name",[sequelize.fn("sum",sequelize.col("expenseofusers.amount")),"TotalCost"]],
      include:[{
        model:Expense,
        attributes:[]
      }],
      group:["user.id" ],
      order:[["TotalCost","DESC"]]
    })
    console.log("Prateekkkk",leaderBoard);
    res.status(200).json(leaderBoard)
    }