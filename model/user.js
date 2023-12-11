const mongoose=require("mongoose");
const bcryptjs=require("bcryptjs");

require("dotenv").config();

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:[true,"firstname is required"],
       
        lowercase:true
    },
    lastname:{
        type:String,
        required:[true,"lastname is required"],
       
        lowercase:true 
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minLength:[8,"Password must be atleast 8 characters long"]
    }
});

userSchema.pre("save",async function(next){
    try{
        const salt= await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password,salt);
    }catch(e){
        console.log(e);
    }
});



userSchema.statics.login= async function(email,password){

    const user= await this.findOne({email});
    try{
       if(user){
         
   
           const isAuth =  await bcrypt.compare(password,user.password);
           if(isAuth){
             return user;
           }
           else{
             throw Error("Password incorrect");
           }
         }
      else{
         throw Error("Incorrect Email");
      }
    }catch(e){
       console.log(e);
    }
   
};







const User=mongoose.model("users",userSchema);
module.exports=User;

