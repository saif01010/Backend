import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


// const unlinkFiles = asyncHandler(async(files)=>{
//     fs.unlink(files)
// });
const generateAccessTokenAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {accessToken, refreshToken};


    } catch (error) {
        throw new ApiError(500, error.message||"Something went wrong while generating referesh and access token");
    }
};
const registerUser = asyncHandler(async(req,res,next)=>{
    
    const {username,email,password,fullname} = req.body;

    if([ email, username, password,fullname].some((field) => field?.trim() === "")){
        throw new ApiError(400,"All fields are required");
    };

    const registeredUser =  await User.findOne({
        $or:[{email},{username}]
    });

    if(registeredUser){
        throw new ApiError(400,"User already exists");
    };

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) 
    {
        throw new ApiError(400,"Avatar is required");
    };

  const avatar= await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverLocalPath);

   const user = await User.create({
        username:username.toLowerCase(),
        email,
        password,
       fullname,
        avatar:avatar.url,
        coverImage: coverImage?.url||""
    });

  const createdUser =  await User.findById(user._id).select(
        "-password -refreshToken"
    );
    // const createdUser = await User.findById(user._id).select(
    //     "-password -refreshToken"
    // )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    // unlinkFiles(avatarLocalPath);
    // unlinkFiles(coverLocalPath);
    return res.status(201).json(
        new ApiResponse(200, createdUser,"User registered Successfully")
    )
    
});
const loginUser = asyncHandler(async(req,res,next)=>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie
    const {username,email,password} = req.body;
    if(!(username || email)) {
        throw new ApiError(400,"Username or email is required");
    };
   const user = await User.findOne({
        $or: [{username},{email}]
    });
    if(!user){
        throw new ApiError(404,"User not found");
    };
   const isPasswordRight = await user.isPasswordCorrect(password);
    if(!isPasswordRight){
          throw new ApiError(400,"Password is incorrect");
    };
   
    const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const option = {
        httpOnly : true,
        secure:true
    }
    return res.status(200)
    .cookie("refreshToken",refreshToken,option)
    .cookie("accessToken",accessToken,option)
    .json(
        new ApiResponse(200,{
            user:loggedInUser,
            accessToken,
            refreshToken
        
        },"User logged in successfully")
    )
});
const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {$set: {
            accessToken: undefined,
        }},
        {
            new:true,
        })
        const option = {
            httpOnly:true,
            secure:true
        }

        return res.status(200)
        .cookie("accessToken",option)
        .json(new ApiResponse(201,{},"Logged Out Successfully"))
});
const refreshTokenEndPoint = asyncHandler(async(req,res)=>{
      const incomingRefreshToken =   req.cookies.refreshToken || req.body.refreshToken;
      if(!incomingRefreshToken){
        throw new ApiError(400,"Refresh Token is required");
      }
    try {
        const decodedToken =   jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
        if(!decodedToken){
            throw new ApiError(400,"Invalid Refresh Token");
        
        }
       const user = await User.findById(decodedToken?._id);
       if(!user){
              throw new ApiError(400,"User not found");
       }
       if(user.refreshToken !== incomingRefreshToken){
           throw new ApiError(400,"Invalid Refresh Token");
       };
    const {accessToken,newRefreshToken}  = await generateAccessTokenAndRefreshToken(user._id)

    const option = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("refreshToken",newRefreshToken,option)
    .cookie("accessToken",accessToken,option)
    .json(new ApiResponse(200,{
        accessToken,
        newRefreshToken
    },"Token Refreshed Successfully"))

    } catch (error) {
        throw new ApiError(400,error.message||"Invalid Refresh Token");
    }
});
const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {currentPass, newPassword} = req.body;
    if(!(currentPass||newPassword)){
        throw new ApiError(400,"Current Password and New Password are required");
    } 
    const user = await User.findById(req.user?._id);
    const correctPass = user.isPasswordCorrect(currentPass);
    if(!correctPass){
       throw new ApiError(400,"Current Password is incorrect");
   }
    user.password = newPassword;
    await user.save({validateBeforeSave:false});
    return res.status(200)
    .json(new ApiResponse(200,{},"Password Changed Successfully"));
});
const getCurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(200,req.user,"User Details Fetched Successfully"));
});
const updateUserInformation = asyncHandler(async(req,res)=>{
    const {fullname}= req.body;
    if(!fullname){
        throw new ApiError(400,"Fullname is required");
    };
 const user =    await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            fullname
        }
    },{
        new:true
    }).select("-password");
    return res.status(200)
    .json(new ApiResponse(200,user,"User Information Updated Successfully"));
})
const avatarUpdate = asyncHandler(async(req,res)=>{
   const avatarLocalPath = req.file?.path;
   if(!avatarLocalPath){
       throw new ApiError(400,"Avatar is required");
   };
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   if(!avatar.url){
    throw new ApiError(500,"Something went wrong while uploading avatar");
   }
  const user =  await User.findByIdAndUpdate(req.user?._id,{
    $set:{
        avatar: avatar.url
    }
   },{
         new:true
    }).select("-password");

    // unlinkFiles(avatarLocalPath);

    return res.status(200)
    .json(new ApiResponse(200,user,"Avatar Updated Successfully"));
});
const coverImageUpdate = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400,"coverImage is required");
    };
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!coverImage.url){
     throw new ApiError(500,"Something went wrong while uploading cover Image");
    }
   const user =  await User.findByIdAndUpdate(req.user?._id,{
     $set:{
        coverImage: coverImage.url
     }
    },{
          new:true
     }).select("-password");

    // unlinkFiles(coverImageLocalPath);
 
     return res.status(200)
     .json(new ApiResponse(200,user,"cover Image Updated Successfully"));

});
const getWatchHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ]);
    return res.status(200)
    .json(new ApiResponse(200,user[0].watchHistory,"fetched watch history successfully"))
});
const getChannelProfile = asyncHandler(async(req,res)=>{
        const {username} = req.params;
        if(!username?.trim()){
           throw new ApiError(400,"Username is invalid");
        };
       const channel = await User.aggregate([
            {
            $match:{
                username:username
            },
        },
        {
            $lookup:{
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup:{
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers"
                },
                subscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in: [req.user?._id, "$subscribers.subscriber"]},
                    then: true,
                    else: false
                    }
                }
            }
        },
        
        {
            $project:{
                fullname:1,
                username:1,
                avatar:1,
                coverImage:1,
                subscribedToCount:1,
                subscribersCount:1

            }
        }
    ]);
    if(!channel?.length){
      throw  new ApiError(401,"channel does not exists")
    };
    return res.status(200)
    .json(new ApiResponse(201,channel[0],"fetched User Profile Successfully"));
});


export {registerUser,loginUser,
    logoutUser,refreshTokenEndPoint,
    changeCurrentPassword,getCurrentUser,
    updateUserInformation,avatarUpdate,
    coverImageUpdate,getChannelProfile,
    getWatchHistory};