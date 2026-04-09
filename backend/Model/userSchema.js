import mongoose from 'mongoose';

export const userSchema=new mongoose.Schema({
   name:{type:String,required:true,maxLength:[25,"maximum limit reached"]},
   email:{type:String,required:true,unique:true,match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]},
   password:{type:String,required:true,minLength:[8,"Password must be of atleast 8 Characters"]},
//    enum ka matlab hai ki inme se koi do role he ho sakta hai
   role:{type:String,enum:['user','admin'],required:true}
});

const user=mongoose.model('User',userSchema);

export default user;