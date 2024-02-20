import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const createTweet = asyncHandler(async(req,res)=>{
    const {content} = req.body;
    if(!content){
        throw new ApiError(400,"Please provide tweet content")
    };
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(404,"User not found");
    };
    const tweet = await Tweet.create({
        content:content,
        user:user._id
    });
    if(!tweet){
        throw new ApiError(401,"Somthing went wrong while creating tweet")
    };
    return res.status(201).
    json(new ApiResponse(201,tweet,"Tweet created successfully"));
});

const getAllTweets = asyncHandler(async(req,res)=>{
    const tweets = await Tweet.find().populate("user","username");
    if(!tweets.length){
        throw new ApiError(404,"No tweets found");
    }
    return res.status(200).json(tweets);
});

const deleteTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params;
    const tweet = await Tweet.findByIdAndDelete(tweetId);
    if(!tweet){
        throw new ApiError(404,"Tweet not found");
    }
    return res.status(200)
    .json(new ApiResponse(200,tweet,"Tweet deleted successfully"));
});

const updateTweet = asyncHandler(async(req,res)=>{
    const {content} = req.body;
    if(!content){
        throw new ApiError(400,"Please provide tweet content")
    };

    const {tweetId} = req.params;
    const tweet = await Tweet.findByIdAndUpdate(tweetId,{
        content:content
    },{new:true}
    );
    if(!tweet){
        throw new ApiError(404,"Tweet not found");
    }
    return res.status(200)
    .json(new ApiResponse(200,tweet,"Tweet Updated successfully"));
});

export {createTweet,getAllTweets,
    deleteTweet,updateTweet};