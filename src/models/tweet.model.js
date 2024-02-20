import mongoose, {Schema} from "mongoose";

const tweetShema = new Schema({
    content:{
        type : String,
        require: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true});

export const Tweet = mongoose.model("Tweet",tweetShema);