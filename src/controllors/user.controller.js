import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async(req,res,next)=>{
    // res.status(200).json({
    //     message:"ok"
    // })
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
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

  const createdUser =   User.findById(user._id).select(
        "-password -refreshToken"
    );
    // const createdUser = await User.findById(user._id).select(
    //     "-password -refreshToken"
    // )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    
    return res.status(201).json(
        new ApiResponse(200, "User registered Successfully")
    )
    
});

export {registerUser};