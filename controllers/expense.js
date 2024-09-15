const User=require("../models/user");
const Expense=require("../models/expense")
const Order=require("../models/orders")
const sequelize=require("sequelize");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Razorpay = require("razorpay");
const AWS=require('aws-sdk')



// exports.addUser=async(req,res)=>{
    
//     try {
//         const { name, email, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing
    
//         const newUser = await User.create({ name, email, password: hashedPassword });
//         res.status(201).json(newUser);
//       } catch (error) {
//         console.error('Error adding user:', error);
//         res.status(500).json({ error: 'An error occurred while adding the user.' });
//       }
//     }    

// exports.loginUser=async(req,res)=>{
//   console.log("hello ");
//     try {

//         const { userName, userPassword } = req.body;
//         console.log(req.body);
//         const user = await User.findOne({ where: { email:userName } });
//         console.log("this is the user after login",user);
//         if (!user) {
//           return res.status(401).json({ error: 'Invalid email or password.' });
//         }
    
//         const isPasswordValid = await bcrypt.compare(userPassword, user.password);
//         if (!isPasswordValid) {
//           return res.status(401).json({ error: 'Invalid email or password.' });
//         }
//         console.log("the log in user",user.id);
//         res.status(200).json({ message: 'Login successful!', token:generateJwtToken(user.id,user.name,user.isPremiumUser) });
//       } 
//       catch (error) {
//         console.error('Error logging in user:', error);
//         res.status(500).json({ error: 'An error occurred while logging in.' });
//       }

      
//     }


    exports.addExpense=async(req,res)=>{
      console.log(req.body,req.user);
      console.log("this is req.user",req.user);
      const userId=req.user.id
      console.log("the user id is this",userId);
      const{amount,description,category}=req.body
      const newExpense=await Expense.create({amount,description,category,userId})
      return res.json({message:"sucessfully Saved Your Data"})
     

    }
    exports.getExpenses = async (req, res) => {
      // try {
      //   console.log("You are in getExpenses");
      //   console.log(req.user.id);
      //   // Assuming req.user contains the authenticated user's details
      //   const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        
      //   if (expenses.length > 0) {
      //     res.status(200).json(expenses);
      //   } else {
      //     res.status(404).json({ message: "No expenses found for this user." });
      //   }
      // } catch (error) {
      //   console.error("Error fetching expenses: ", error);
      //   res.status(500).json({ message: "An error occurred while fetching expenses." });
      // }
    const page = +req.query.page || 1;
    const NUMBER_OF_EXPENSES_PER_PAGE=3;
    let total_items
    Expense.count({where:{userId:req.user.id}})
    .then((total)=>{
        total_items=total
        return Expense.findAll({where:{userId:req.user.id},offset:(page-1)*NUMBER_OF_EXPENSES_PER_PAGE,
        limit:NUMBER_OF_EXPENSES_PER_PAGE})
    })
   

    .then(expenses=>{
          const pagination={
            currentPage:page,
            hasNextPage:NUMBER_OF_EXPENSES_PER_PAGE *page<total_items,
            nextPage:page + 1,
            hasPreviousPage:page>1,
            previousPage:page-1,
            lastPage:Math.ceil(total_items/NUMBER_OF_EXPENSES_PER_PAGE),

        }
        res.status(200).json({expenses,pagination,success:true})
    })
    .catch(err=>{
        res.status(500).json({error:err,success:false})
    })

    };
    
    exports.deleteExpense = async (req, res) => {
      try {
        const id = req.params.id;
        let deleteData = await Expense.destroy({ where: { id } });
        if (deleteData) {
          res.status(200).send({ message: `Expense with ID ${id} deleted successfully` });
        } else {
          res.status(400).send({ message: `Expense with ID ${id} not found` });
        }
        console.log(deleteData);
      } catch (err) {
        console.log("Error in delete function:", err);
        res.status(500).send({ message: "Internal Server Error" });
      }
    };
    


    function generateJwtToken(userId, userName ,isPremiumUser){
    
      return jwt.sign({userId:userId,userName:userName,isPremiumUser:isPremiumUser},"Prateek")

    }

  //   exports.buyPrime=async (req, res) => {
  //     try {
  //         const rzp = new Razorpay({
  //           key_id: process.env.RAZORPAY_KEY_ID,
  //           key_secret: process.env.RAZORPAY_KEY_SECRET
  //         });
  
  //         const amount = 2500;
  
  //         const order = await rzp.orders.create({ amount, currency: "INR" });
  //         await Order.create({orderid: order.id, status: "PENDING",userId:req.user.id})
  //         // await req.user.createOrder({ orderid: order.id, status: "PENDING" });
  //         return res.status(201).json({ order, key_id: rzp.key_id });
  
  //     } catch (err) {
  //         console.error(err);
  //         res.status(403).json({ message: "Something went wrong", error: err });
  //     }
  // }


  // exports.transactionStatus=async(req,res)=>{
  //   try{
  //   console.log(req.body);
  //   const userId=req.user.id
  //   const transactionData=await Order.update({paymentid:req.body.payment_id ,status:"SUCCESSFULL"} ,{where:{ orderid: req.body.order_id }});
  //   const premiumUpdate=req.user.update({isPremiumUser:true},{where:{orderid: req.body.order_id}})
  //   res.status(202).json({message:"transaction Sucessfull",token:generateJwtToken(userId,undefined,true)})
  //   }
  //   catch(err){
  //     console.log(err);
  //   }
  // }


//   exports.getLeaderBoard=async(req,res)=>{
// //   console.log("leaderBoarddata");
// //   const expenses=await Expense.findAll();
// //   const users=await User.findAll();
// //   console.log("expenses data",expenses);
// //   console.log(users);
// //   const expenseDetails={};
// //   const userLeaderBoard=[];
// //   expenses.forEach((expense)=>{
// //     const amount = parseFloat(expense.amount);
// //     if(expenseDetails[expense.userId]){
// //         expenseDetails[expense.userId]=expenseDetails[expense.userId]+expense.amount;
// //     }
// //     else{
// //         expenseDetails[expense.userId]=expense.amount
// //         console.log(expenseDetails[expense.userId]);;
// //     }
// //     console.log(expenseDetails);
// //     // const userLeaderBoard=[];
// // })
// // users.forEach((user)=>{
// //     userLeaderBoard.push({name:user.name,Amount:expenseDetails[user.id] || 0})
// //     console.log(userLeaderBoard);
// // })
// // userLeaderBoard.sort((a,b)=>b.Amount-a.Amount)
// // res.status(200).json(userLeaderBoard);


// ///new code
// const leaderBoard=await User.findAll({
//   attributes:["id","name",[sequelize.fn("sum",sequelize.col("expenseofusers.amount")),"TotalCost"]],
//   include:[{
//     model:Expense,
//     attributes:[]
//   }],
//   group:["user.id" ],
//   order:[["TotalCost","DESC"]]
// })
// console.log("Prateekkkk",leaderBoard);
// res.status(200).json(leaderBoard)
// }
  


//forgot password


// exports.getForgotpassword=async(req,res,next)=>{
//   try {
//       const {email}  =  req.body;
//       const user = await User.findOne({where : { email }});
//       if(user){
//           const id = uuid.v4();
//           user.createForgotpassword({ id , active: true })
//               .catch(err => {
//                   throw new Error(err)
//               })
          


//           sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//           const msg = {
//               to: email,
//               from: 'prateeksharma222000@gmail.com',
//               subject: 'Sending with SendGrid is Fun',
//               text: 'and easy to do anywhere, even with Node.js',
//               html: `<h1>http://localhost:4000/resetpassword/${id}</h1>`,
//           }

//           sgMail
//           .send(msg)
//           .then((response) => {
              
//               // console.log('email sent successfully >>>>email')
//               return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})
//           }).catch(error=>{
//               throw new Error(error)
//           })
//       }else{
//           throw new Error('User doesnot exist')
//       }
       
//   } catch(err){
//       console.error(err)
//       return res.json({ message: err, success: false });
//   }


// }
// exports.getResetpassword=async(req, res) => {
//   const id =  req.params.id;
//   Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
//       if(forgotpasswordrequest){
//           forgotpasswordrequest.update({ active: false});
//           res.status(200).send(`<html>
//                                   <script>
//                                       function formsubmitted(e){
//                                           e.preventDefault();
//                                           console.log('called')
//                                       }
//                                   </script>
//                                   <form action="/updatepassword/${id}" method="get">
//                                       <label for="newpassword">Enter New password</label>
//                                       <input name="newpassword" type="password" required></input>
//                                       <button>reset password</button>
//                                   </form>
//                               </html>`
//                               )
//           res.end()

//       }
//   })
// }
// exports.getUpdatepassword=async(req,res)=>{
//   try {
//       const newpassword  = req.query;
//       const resetpasswordid  = req.params;
//       Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
//           User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
//               // console.log('userDetails', user)
//               if(user) {
//                   //encrypt the password

//                   const saltRounds = 10;
//                   bcrypt.genSalt(saltRounds, function(err, salt) {
//                       if(err){
//                           console.log(err);
//                           throw new Error(err);
//                       }
//                       bcrypt.hash(newpassword, salt, function(err, hash) {
//                           // Store hash in DB
//                           if(err){
//                               console.log(err);
//                               throw new Error(err);
//                           }
//                           user.update({ password: hash }).then(() => {
//                               res.status(201).json({message: 'Successfuly update the new password'})
//                           })
//                       });
//                   });
//           } else{
//               return res.status(404).json({ error: 'No user Exists', success: false})
//           }
//           })
//       })
//   } catch(error){
//       return res.status(500).json({ error, success: false } )
//   }

// }