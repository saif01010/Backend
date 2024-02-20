import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Like} from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Tweet} from "../models/tweet.model.js";
import {User} from "../models/user.model.js";
import {Comment} from "../models/comment.model.js";
import {Video} from "../models/video.model.js";

const toggleLikeVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"Video not found");
    }
    const like = await Like.findOne({video:videoId,user:user._id});
    if(like){
        await Like.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200,{},"Like removed successfully"));
    }
    const newLike = await Like.create({
        video:videoId,
        user:user._id
    });
    if(!newLike){
        throw new ApiError(401,"Somthing went wrong while liking video");
    }
    return res.status(201).json(new ApiResponse(201,newLike,"Video liked successfully"));
});

const toggleLikeComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params;
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404,"Comment not found");
    }
    const like = await Like.findOne({comment:commentId,user:user._id});
    if(like){
        await Like.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200,{},"Like removed successfully"));
    }
    const newLike = await Like.create({
        comment:commentId,
        user:user._id
    });
    if(!newLike){
        throw new ApiError(401,"Somthing went wrong while liking comment");
    }
    return res.status(201).json(new ApiResponse(201,newLike,"Comment liked successfully"));
});

const toggleLikeTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params;
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404,"Tweet not found");
    }
    const like = await Like.findOne({tweet:tweetId,user:user._id});
    if(like){
        await Like.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200,{},"Like removed successfully"));
    }
    const newLike = await Like.create({
        tweet:tweetId,
        user:user._id
    });
    if(!newLike){
        throw new ApiError(401,"Somthing went wrong while liking tweet");
    }
    return res.status(201).json(new ApiResponse(201,newLike,"Tweet liked successfully"));
});



export {toggleLikeVideo,toggleLikeComment,toggleLikeTweet};