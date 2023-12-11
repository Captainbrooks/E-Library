const mongoose = require("mongoose");


const UserMessageSchema=new mongoose.Schema({
    fname:{
        type:String,
     
     
    },
    lname: {
        type: String,
      
    },
    Phone: {
        type: String,
     
    },
    useremail:{
        type:String,
      
    },
    msg:{
        type:String,
    }
 
});

const UserMsg=mongoose.model("userMessage",UserMessageSchema);

module.exports=UserMsg;