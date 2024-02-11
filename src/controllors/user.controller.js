import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from "../utils/ApiResponse.js"

const generateAccessTokenAndRefreshToken = async(userId)=>{
   try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
   await user.save({ValidateBeforeSave:false});
    return {accessToken,refreshToken};
    
   } catch (error) {
         throw new ApiError(500,"Something went wrong while generating tokens");
    
   }
}

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

  const createdUser =  await User.findById(user._id).select(
        "-password -refreshToken"
    );
    // const createdUser = await User.findById(user._id).select(
    //     "-password -refreshToken"
    // )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    
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
    if(!username || !email) {
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
})
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
})
export {registerUser,loginUser,logoutUser};