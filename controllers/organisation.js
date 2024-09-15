const express=require("express");
const Donation=require("../models/donation");
const Organisation = require("../models/organisation");
const User = require("../models/user");

exports.getDonorData=async(req,res)=>{
    const userId = req.userId;
    console.log(userId);

    try {
       
        const donationData = await Donation.findAll({
            where: { organisationId: userId },
            attributes: ['id', 'amount', 'userId'], 
        });

        console.log("Donation data fetched: ", donationData);

        // Step 2: Extract user IDs from the donation data
        const userIds = donationData.map(donation => donation.userId);

        // Step 3: Fetch the user names based on the user IDs
        const users = await User.findAll({
            where: { id: userIds },
            attributes: ['id', 'name'], // Fetch the relevant fields
        });

        // Step 4: Create a map of userId to userName
        const userMap = {};
        users.forEach(user => {
            userMap[user.id] = user.name;
        });

        // Step 5: Combine the donation data with the user names
        const combinedData = donationData.map(donation => ({
            id: donation.id,
            amount: donation.amount,
            userId: donation.userId,
            userName: userMap[donation.userId] // Fetch the name from the userMap
        }));

        res.status(201).json({ message: "Data fetched successfully",combinedData });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Error fetching data" });
    }
};