const sequelize=require("sequelize");
const db=require("../utils/database")

const User=db.define("user",{
    name:{
        type:sequelize.STRING
    },
    email:{
        type:sequelize.STRING,
        unique:true
    },
    password:{
        type:sequelize.STRING
    }
});
module.exports=User;