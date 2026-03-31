const mongoose=require("mongoose");//mongoose library import kr liya
const connectDB=async()=>{//async function banaya jisme mongodb se connect krne ka code hoga
    try{
        await mongoose.connect(process.env.MONGODB_URI);//mongoose ka connect method use kiya jisme uri pass kiya jo env file se aayega
        console.log("MongoDB connected");
    }
    catch(error){
        console.log(error);
    }
}
module.exports=connectDB;