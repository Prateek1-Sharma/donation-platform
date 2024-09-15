const sequelize=require("sequelize");
const db=require("../utils/database");

const donation=db.define("donation",{
    amount:{type:sequelize.NUMERIC}
})

module.exports=donation;