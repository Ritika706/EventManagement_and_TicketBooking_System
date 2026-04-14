const mongoose=require("mongoose");
const eventSchema=new mongoose.Schema({//schema of events
    title:String,
    date:String,
    venue:String,
    price:Number,
    total_tickets:Number,
    available_tickets:Number
});
module.exports=mongoose.model("Event",eventSchema);//exporting the model