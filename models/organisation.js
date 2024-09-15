const sequelize=require("sequelize");
const db=require("../utils/database")

const Organisation=db.define("organisation",{
    name:{
        type:sequelize.STRING
    },
    email:{
        type:sequelize.STRING,
        unique:true
    },
    password:{
        type:sequelize.STRING
    },
    amount:{
        type:sequelize.INTEGER
    },
    goal:{
        type:sequelize.STRING
    }
});
module.exports=Organisation;