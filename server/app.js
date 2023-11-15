const express=require("express");
const passport=require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy=require("passport-jwt").Strategy;
const User = require("./models/user");
 const app=express();
app.use(express.json())
const mongo=require("mongodb")
const mongoose=require("mongoose");
const dotenv=require("dotenv");

const port=process.env.PORT||8000;
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

const authRoutes=require("./routes/auth")

 
mongoose.connect(
   "mongodb+srv://shreyarakesh009:PPasworD010@cluster0.3lnzq8t.mongodb.net/"
    

).then((x)=>{
    console.log("Connected to mongodb");
}).catch((err)=>{
    
    console.log("Error occured while connecting to mongodb ");
    console.log(err);
})


let opts={}
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey="ksfknkknvoaovno";
passport.use(new JwtStrategy(opts,async function(jwt_payload,done){
  const user=  await User.findOne({_id:jwt_payload.identifier}) 
           
            try{
            if(user){
                done(null,user);
            }
            else{
                done(null,false);
            }
        }catch(err){
            if(err){
                done(err,false);
            }
        }
    
  }))
 
  app.use(express.static(path.join(__dirname, '../client')));

 

  app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname, '../client/login/index.html'));
    
})

app.get("/register",(req,res)=>{
    res.sendFile(path.join(__dirname, '../client/registration/registration.html'));
    
})

 
app.use("/auth",authRoutes);
app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
}) 