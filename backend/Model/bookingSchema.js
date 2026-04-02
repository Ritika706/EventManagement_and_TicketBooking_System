import mongoose from 'mongoose';

const bookings=new mongoose.Schema({
    // we will get this id from mongoDb so our user can book the ticket of that particular event
    //   Event ka matlab ki ye eventId Event wale collection se linked hai
   eventId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"Event"},
   userName:{type:String,required:true,maxLength:[25,"maximum length reached for naming convention"]},
   quantity:{type:Number,required:true},
   createdAt:{type:Date,default:Date.now},
   updatedAt:{type:Date,default:Date.now}

});

const bookingModel=mongoose.model("Booking",bookings);

export default bookingModel;