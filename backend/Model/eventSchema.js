import  mongoose from 'mongoose';


const eventSchema=new mongoose.Schema({//schema of events
    title:{type:String,required:true},
    date:{type:String,required:true},
    venue:{type:String,required:true},
    price:{type:Number,required:true},
    total_tickets:{type:Number,required:true},
    available_tickets:{type:Number,required:true}
    
});


const eventModel=mongoose.model("Event",eventSchema);

// exporting event 
export default eventModel;

