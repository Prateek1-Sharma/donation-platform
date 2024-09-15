const express=require("express");
const app=express();
const bodyParser=require("body-parser")
const cors=require("cors");
const helmet=require("helmet");

const expenseRoutes=require("./routes/expense");
const userRoutes=require("./routes/user")
const purchaseRoutes=require("./routes/purchase")
const premiumRoutes=require("./routes/premium ")
const organisationRoutes=require("./routes/organisation")

const dbConnect=require("./utils/database")
const user=require("./models/user");
const expense=require('./models/expense')
const order=require("./models/orders")
const donation=require("./models/donation");
const organisation = require("./models/organisation");
require('dotenv').config();

app.use(cors());
app.use(helmet())
app.use(bodyParser.json());
app.use("/user",userRoutes);
app.use("/expense",expenseRoutes);
app.use("/purchase",purchaseRoutes);
app.use("/premium",premiumRoutes);
app.use(organisationRoutes);
expense.belongsTo(user);
user.hasMany(expense);
user.hasMany(order);
order.belongsTo(user);
donation.belongsTo(organisation);
organisation.hasMany(donation);
donation.belongsTo(user);
user.hasMany(donation);
dbConnect.sync().then(()=>{
    app.listen(4000);
    console.log("Databse Connected");    
})