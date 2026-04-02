import bookingModel from '../Model/bookingSchema.js';
import eventModel from '../Model/eventSchema.js';

export const bookTicket =async (req,res)=>{
    try{
        const {eventId,userName,quantity}=req.body;
        
        // Input Validation 
        if(!eventId || !quantity || !userName){
          return res.json({message:"event id or quantity or userName not provided in bookTicketController"});
        }
        const event=await eventModel.findById(eventId);
        
        // what if event doesnot exist
        if(!event){
            return res.status(404).json({message:"Event does not exist"});
        }

    //    check whether the tickets are available or not so that
    //  we make sure the quantity doesnot go negative

    if(event.available_tickets<quantity){
    return res.status(400).json({message:"tickets are not available,try reducing the number of tickets"});

    }
    
        const totalPrice=quantity*event.price;

         // after booking the tickets , hum ab quantity reduce kardenge
        const remaining_tickets =event.available_tickets-quantity;
        event.available_tickets=remaining_tickets;

        // to save the data in our database
        await event.save();


        const newBooking = await bookingModel.create({eventId,userName,quantity,totalPrice});

        res.status(201).json({message:"Booking Completed",newBooking});

    }catch(error){
        res.status(400).send(error.message);
        throw error;
    }
}





// NOW THESE NEXT FUNCTIONS ARE FOR THE ADMIN PURPOSES


// get all the bookings 

export const getAllBooking=async(req,res)=>{
    try{
        const allbookings=await bookingModel.find();
        res.status(200).json({message:"All the Bookings : ",allbookings});

    }catch(error){
        res.status(401).json({error:error.message});
    }
}



// get all the bookings by id

export const getBookingById=async(req,res)=>{
    try{
      const id=req.param.id;
      const booking=await bookingModel.findById(id);

      if(!booking){
        return res.status(404).json({message:"Id not Found "});
      }

     res.status(200).json({message:"Found the booking by id ", booking});

    }catch(error){
        res.status(500).json({error:error.message});
    }
}
