import {Video} from '../models/video.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {getVideoDurationInSeconds} from 'get-video-duration';
import {User} from '../models/user.model.js';
//import fs from 'fs';
import mongoose from 'mongoose';
import { ApiResponse } from '../utils/ApiResponse.js';
// const unlinkFiles = asyncHandler(async(files)=>{
//     fs.unlink(files)
// });



const uploadVideo = asyncHandler(async(req,res)=>{
    const {title,description} = req.body;
    if(!(title && description)){
        throw new ApiError(400,"Please provide title, description ");
    };
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if(!thumbnail.url){
        throw new ApiError(500,"Error uploading thumbnail");
    }
    const videoLocalPath = req.files?.videoUrl[0]?.path;
    const videoUrl = await uploadOnCloudinary(videoLocalPath);
    if(!videoUrl.url){
        throw new ApiError(500,"Error uploading video");
    };
    const duration = await getVideoDurationInSeconds(videoUrl.url);
    if(!(duration)){
        throw new ApiError(500,"Error getting video duration");
    }
    const owner = await User.aggregate([{
        $match:{
            _id: new mongoose.Types.ObjectId(req.user._id)
        }
    
    },
    {
        $project:{
            username:1
        }
    }
]);

    if(!owner.length){
        throw new ApiError(404,"User not found");
    }
    //console.log(owner[0].username);
    const video = await Video.create({
        title,
        description,
        videoUrl:videoUrl.url,
        thumbnail:thumbnail.url,
        duration:duration,
        owner:owner[0]
    });

    if(!video){
        throw new ApiError(500,"Error creating video");
    }
    // unlinkFiles(thumbnailLocalPath);
   return res.status(201)
   .json(new ApiResponse(201,video,"Video uploaded successfully"));

});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(400, "Please provide video id")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    return res.status(200).json(video)
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // Update video details like title, description, thumbnail
    const { title, description } = req.body; 
    console.log(title, description);
    if (!title && !description) {
        throw new ApiError(400, "Please provide title, description ")
    };
    
    const video = await Video.findByIdAndUpdate(videoId, {
        title,
        description
    }, { new: true })
    if (!video) {
        throw new ApiError(500, "Error updating video")
    }
    return res.status(200)
    .json(new ApiResponse(200,video,"Video updated successfully"))
});

const updateThumbnail = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const thumbnailLocalPath = req.file?.path;
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail.url) {
        throw new ApiError(500, "Error uploading thumbnail")
    }
    const video = await Video.findByIdAndUpdate(videoId, {
        thumbnail: thumbnail.url
    }, { new: true })
    if (!video) {
        throw new ApiError(500, "Error updating thumbnail")
    }
    return res.status(200).json(new ApiResponse(200,video,"Thumbnail updated successfully"))
});
const deleteVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    if(!videoId){
        throw new ApiError(400,"Please provide video id");
    }
    const video = await Video.findByIdAndDelete(videoId);
    if(!video){
        throw new ApiError(404,"Video not found");
    }
    return res.status(200).json(new ApiResponse(200,video,"Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    const updatedVideo = await Video.findByIdAndUpdate
    (videoId, { isPublished: !video.isPublished }, { new: true })
    if (!updatedVideo) {
        throw new ApiError(500, "Error updating video")
    }
    return res.status(200).json(updatedVideo)
});

export {uploadVideo,getVideoById,
    updateVideo,updateThumbnail
    ,deleteVideo,togglePublishStatus};