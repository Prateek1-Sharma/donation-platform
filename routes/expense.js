const express=require("express");
const router=express.Router();
const expenseController=require("../controllers/expense")
const auth=require("../middleware/auth");

// router.post("/userSignup",expenseController.addUser)
// router.post("/user/login",expenseController.loginUser)
router.post("/add/expenses",auth,expenseController.addExpense)
router.get("/get/allExpenses",auth,expenseController.getExpenses)
router.delete(`/:id/deleteExpenses`,expenseController.deleteExpense)
// router.get("/buyPremium",auth,expenseController.buyPrime)
// router.post("/updateStatus",auth,expenseController.transactionStatus)
// router.get("/showLeaderBoard",auth,expenseController.getLeaderBoard)
// router.get("/download",auth,expenseController.getDownload);
// router.use('/forgotpassword',expenseController.getForgotpassword)
// router.get('/resetpassword/:id',expenseController.getResetpassword)
// router.get('/updatepassword/:resetpasswordid',expenseController.getUpdatepassword)
module.exports=router