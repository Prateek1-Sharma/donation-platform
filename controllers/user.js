const User=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Razorpay = require("razorpay");
const Donation=require("../models/donation");
const Organisation=require("../models/organisation")

exports.addOrgansisation=async(req,res)=>{
    
  try {
      const { name, email, password, amount, goal} = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing
  
      const newUser = await Organisation.create({ name, email, password: hashedPassword, amount, goal });
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error adding Organsisation:', error);
      res.status(500).json({ error: 'An error occurred while adding the Organisation.' });
    }
  } 

exports.addUser=async(req,res)=>{
    
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing
    
        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json(newUser);
      } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'An error occurred while adding the user.' });
      }
    } 

    exports.loginUser=async(req,res)=>{
        console.log("hello ");
          try {
      
              const { userName, userPassword ,role} = req.body;
              console.log(req.body);
              console.log(role);
              if(role=="user"){
              const user1 = await User.findOne({ where: { email:userName } });
              console.log("this is the user after login",user1);
              if (!user1) {
                return res.status(401).json({ error: 'Invalid email or password.' });
              }
          
              const isPasswordValid = await bcrypt.compare(userPassword, user1.password);
              if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password.' });
              }
              console.log("the log in user",user1.id);
              res.status(200).json({ message: 'Login successful!', token:generateJwtToken(user1.id,user1.name) });
            } 
            if(role=="organization"){
              const user = await Organisation.findOne({ where: { email:userName } });
              console.log("this is the user after login",user);
              if (!user) {
                return res.status(401).json({ error: 'Invalid email or password.' });
              }
          
              const isPasswordValid = await bcrypt.compare(userPassword, user.password);
              if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password.' });
              }
              console.log("the log in user",user.id);
              res.status(201).json({ message: 'Login successful!', token:generateJwtToken(user.id,user.name) });
            }}
            catch (error) {
              console.error('Error logging in user:', error);
              res.status(500).json({ error: 'An error occurred while logging in.' });
            }
      
            
          }

          exports.getOrganisations=async(req,res)=>{
            try {
              const organisations=await Organisation.findAll({
                attributes: ['name','id','goal'],
              })
              console.log(organisations);
             
              res.json(organisations)

            } catch (error) {
              console.log('Error fetching organisations:', error);
              res.status(500).json({ error: 'An error occurred while fetching organisations.' });
          }
            }


            exports.getDonationHistory=async(req,res)=>{
              try{
                const userId = req.userId;
    
                // Fetch all donations for the user
                const donations = await Donation.findAll({ where: { userId: userId } });
                console.log(donations);
            
                if (donations.length === 0) {
                  return res.status(404).json({ message: 'No donations found for this user' });
                }
            
                // Extract organisationIds from donations
                const organisationIds = donations.map(donation => donation.organisationId);
            
                // Fetch organisations using the extracted organisationIds
                const organisations = await Organisation.findAll({
                  where: {
                    id: organisationIds
                  }
                });
            
                // Create a map of organisationId to organisation name for quick lookup
                const organisationMap = organisations.reduce((acc, org) => {
                  acc[org.id] = org.name;
                  return acc;
                }, {});
            
                // Combine donation details with organisation names
                const response = donations.map(donation => ({
                  id: donation.id,
                  amount: donation.amount,
                  createdAt: donation.createdAt,
                  updatedAt: donation.updatedAt,
                  organisationName: organisationMap[donation.organisationId]
                }));
            
                console.log(response);
                
                // Send the collective response
                res.json(response);
              // res.status(201).json({message:"Fetched Succesfully",donationHistory})
              }
              catch(err){
               res.status(401).json({message:"Error in controllers"}) ;
              }
              
            }

          


          function generateJwtToken(userId, userName){
    
            return jwt.sign({userId:userId,userName:userName},"Prateek")
      
          }