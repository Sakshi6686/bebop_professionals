const express=require("express");
const User = require("../models/user");
const router=express.Router();
const bcrypt=require("bcrypt");
const {getToken}=require("../utils/helper")


router.post("/register",async (req,res)=>{

    const{firstName,lastName,email,password}=req.body;

    if(!firstName||!email||!password){
        return res.status(400).json({err:"Invalid request body"});
    }

    const existingUser=await User.findOne({email:email});
    if(existingUser){
        return res.status(402).json({err:"A user with this email already exist"})
    }


    const hashedPassword=await bcrypt.hash(password,10);
    const newUserDetails={
        firstName,
        lastName,
        email,
        password:hashedPassword
    };
    const newUser=await User.create(newUserDetails);

    const token=await getToken(email,newUser);

    const  userToReturn={...newUser.toJson(),token};

    delete userToReturn.password;
    return res.status(200).json(userToReturn);


})


router.post("/login",async (req,res)=>{

    const {email,password}=req.body;
    if(!user||!password){
        return res.status(401).json({err:"Invalid username or password"});
    }
    const user=await User.findOne({email:email});
    if(!user){
        return res.status(401).json({err:"Invalid username or password"});
    }


    const isPasswordValid=await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(401).json({err:"Invalid username or password"});
    }

    const token=await getToken(email,user);

    const  userToReturn={...user.toJSON(),token};

    delete userToReturn.password;
    return res.status(200).json(userToReturn);

    


})


module.exports=router;
