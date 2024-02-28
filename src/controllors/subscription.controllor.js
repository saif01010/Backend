import {Subscription} from '../models/subscription.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
// import { Video } from '../models/video.model.js';

const toggleSubscriber = asyncHandler(async(req,res)=>{
    const {channelId} = req.params;
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const channel = await User.findById(channelId);
    if(!channel){
        throw new ApiError(404,"Channel not found");
    }
    const subscription = await Subscription.findOne({subscriber:req.user._id,channel:channelId});
    if(subscription){
        await Subscription.findByIdAndDelete(subscription._id);
        return res.status(200).json(new ApiResponse(200,{},"Unsubscribed successfully"));
    };
    const newSubscription = await Subscription.create({

        subscriber:user._id,
        channel:channelId
    });
    if(!newSubscription){
        throw new ApiError(401,"Somthing went wrong while subscribing");
    }
    return res.status(201).json(new ApiResponse(201,newSubscription,"Subscribed successfully"));
});

export {toggleSubscriber};