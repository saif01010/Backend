import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
// import mongoose from "mongoose";

const createComment = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const {content} = req.body;
    if(!(content)){
        throw new ApiError(400,"Please provide content");
    }
    
    const video = await Video.findById(videoId);
    const owner = await User.findById(req.user._id);
    if(!owner){
        throw new ApiError(404,"User not found");
    }
    const comment = await Comment.create({
        content:content,
       video: video._id,
        owner:owner._id
    });
    if(!comment){
        throw new ApiError(401,"Somthing went wrong while creating comment")
    }
    
    return res.status(201)
    .json(new ApiResponse(201,comment,"Comment created successfully"));
});
const getAllComments = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const comments = await Comment.find({video:videoId}).populate("owner","username");
    if(!comments.length){
        throw new ApiError(404,"No comments found");
    }
    return res.status(200).json(comments);
});

const editComment = asyncHandler(async(req,res)=>{
    const {content} = req.body;
    if(!content){
        throw new ApiError(400,"Please provide comment content")
    };
    const {commentId} = req.params;
    const comment = await Comment.findByIdAndUpdate(commentId,{
        content:content
    },{new:true}
    );
    if(!comment){
        throw new ApiError(404,"Comment not found");
    }
    return res.status(200)
    .json(new ApiResponse(200,comment,"Comment Updated successfully"));
});

const deleteComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params;
    const comment = await Comment.findByIdAndDelete(commentId);
    if(!comment){
        throw new ApiError(404,"Comment not found");
    }
    return res.status(200)
    .json(new ApiResponse(200,comment,"Comment deleted successfully"));
});
export {createComment,getAllComments,
    deleteComment,editComment};