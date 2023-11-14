const mongoose=require("mongoose")


const UserSchema=new mongoose.Schema({
    firstName:{
       type: String,
       required:true,
    },
    LastName:{
        type: String,
        required:true,
     },
     email:{
        type: String,
        required:true,
     },password:{
        type: String,
        required:true,
     },
     confirmPassword:{
      type: String,
      required:true,
   },
 country:{
      type: String,
      required:true,
   },
   city:{
      type: String,
      required:true,
   },
   studentOrworking:{
      type: String,
      required:true,
   },
  collegeName:{
      type: String,
      required:true,
   },
 startingYear:{
      type: String,
      required:true,
   },
  endingYear:{
      type: String,
      required:true,
   },
  companyName:{
      type: String,
      required:true,
   },
   designation:{
      type: String,
      required:true,
   },
     experiences:{
         
        type: String,
     },
     projects:{
        
        type: String,
     },
     skills:{
        
       type: String,
     },
})

const User=mongoose.model("User",UserSchema);

module.exports=User;