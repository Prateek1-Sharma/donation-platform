const sequelize=require("sequelize");
const db=new sequelize("newdonation","root","Prateek@my2000",{
    dialect:"mysql",
    host:"localhost"
})
module.exports=db;