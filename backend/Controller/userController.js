import user from '..Model/userSchema.js';
import bcrypt from 'bcrypt';

// create user

export const createUser=async(req,res)=>{
 try{
    const {name,email,password,role}=req.body;
    // to protect the password
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const newUser=await user.create({
        name:name,
        email:email,
        password:hashedPassword,
        role:"user"
    });
   
    res.status(201).json({message:"User Created",newUser});


 }catch(error){
        res.status(500).json({error:error.message});
 }
}


