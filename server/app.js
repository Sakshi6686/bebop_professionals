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
const authRoutes=require("./routes/auth")
const port=process.env.PORT||8000;

dotenv.config();
const encodedPassword = encodeURIComponent('bebop#546');
 
mongoose.connect(
    "mongodb+srv://bebopProfessional:${encodedPassword}@cluster0.hrjmafg.mongodb.net/?retryWrites=true&w=majority"

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
 


 

app.get("/",()=>{

})


app.use("/auth",authRoutes);
app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
}) 
