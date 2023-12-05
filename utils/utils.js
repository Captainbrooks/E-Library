const jwt=require("jsonwebtoken");
const User=require("../model/user");
require("dotenv").config();


const createToken=(id)=>{
     return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:3*24*60*60})
};


const requireAuth = (req,res,next)=>{
     const token=req.cookies.jwt;
     if(token){
      jwt.verify(token,process.env.JWT_SECRET,(err,decodedToken)=>{
          if(err){
               console.log(err);
               res.redirect("/login");

          }
          else{
               console.log(decodedToken);

               //for role based authentication
//                if(decodedToken.id===1){
// next()
//                }
//                else{

//                }
               next();
          }
      })
     }
     else{

          // client is not passing a token
          console.log("token is undefined");
          res.redirect("/login");
     }
}


module.exports={createToken,requireAuth};