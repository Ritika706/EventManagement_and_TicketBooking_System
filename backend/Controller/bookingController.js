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

    if(event.available_ticket<quantity){
    return res.status(400).json({message:"tickets are not available,try reducing the number of tickets"});

    }
    
        const totalPrice=quantity*event.price;

         // after booking the tickets , hum ab quantity reduce kardenge
        const remaining_tickets =event.available_ticket-quantity;
        event.available_ticket=remaining_tickets;

        // to save the data in our database
        await event.save();


        const newBooking = await bookingModel.create({eventId,userName,quantity,totalPrice});

        res.status(201).json({message:"Booking Completed",newBooking});

    }catch(error){
        res.status(400).send(error.message);
        throw error;
    }
}