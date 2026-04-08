import user from '..Model/userSchema.js';
import bcrypt from 'bcrypt';



// create user
export const createUser=async(req,res)=>{
 try{
    const {name,email,password,role}=req.body;
    // to protect the password using encryption
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



// FOR ADMIN 


// get all the users

export const getAllUsers=async(req,res)=>{
    try{
         const allusers=await user.find();
         res.status(200).json({message:"All Users : ",allusers});
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
}


// get the user by id

export const getUserById=(req,res)=>{
    try{
        const id=req.params.id;
        const oneuser=user.findById(id);
        if(!oneuser){
            return res.status(404).json({message:"User Does not exist"});
        }
        res.status(200).json({message:"User Found by id : ",oneuser});

    }catch(error){
        res.status(500).json({message:"Server error "});
    }
}

// delete user if the user is invalid or for any other reasons

export const deleteUserById=async (req,res)=>{
    try{
        const id=req.params.id;
        const idx=await user.find(id);
        if(idx===-1){
            return res.status(404).json({message:"User Does not exist"});
        }

        user=user.splice()
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
}