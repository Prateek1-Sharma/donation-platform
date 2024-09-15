const sequelize=require("sequelize");
const db=require("../utils/database");

const expenseOfUser=db.define("expenseofusers",{
    amount:{
        type:sequelize.INTEGER
    },
    description:{type:sequelize.STRING
    },
    category:{
        type:sequelize.STRING
    }

});
module.exports=expenseOfUser;