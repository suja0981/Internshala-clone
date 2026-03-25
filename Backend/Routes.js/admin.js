const express = require('express');
const router = express.Router();
const adminuser='admin';
const adminpassword='admin';

router.post("/adminlogin",(req,res)=>{
    const {username,password}=req.body;
    if(username===adminuser && password===adminpassword){
        res.status(200).json({message:"Login successful"});
    }else{
        res.status(401).json({message:"Invalid credentials"});  
    }
    });

    module.exports = router;