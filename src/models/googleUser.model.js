import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
   displayName:{
        type:String,
        required:true
    
   },
    picture:{
        type:String,
        required:true
    }
},{timestamps:true});


const GoogleUser = mongoose.model('GoogleUser', userSchema);

export {GoogleUser};
