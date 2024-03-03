import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";

const userShema = new Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        index:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        index:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        trim:true
    },
    avatar:{
        type:String,
        require:true
        
    },
    coverImage:{
        type:String
    },
    watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],
    refreshToken:{
        type: String
    }
},{timestamps:true});

userShema.plugin(mongooseAggregatePaginate);

userShema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});
userShema.methods.isPasswordCorrect = function(password){
    return bcrypt.compare(password,this.password);
};

userShema.methods.generateAccessToken = function(){
    return Jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRE
    })
}
userShema.methods.generateRefreshToken = function(){
    return Jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRE
    })
}
export const User = mongoose.model("User",userShema);