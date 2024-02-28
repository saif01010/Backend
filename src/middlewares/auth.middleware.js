import jwt from 'jsonwebtoken';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
       try {
        const token =  req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ","");
        if(!token){
         throw new ApiError(400,"Unauthorized access");
        }
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await  User.findById(decodedToken?._id).select("-password");
        if(!user){
        throw new ApiError(400,"Unauthorized access");
        }
        req.user = user;
          next();
        } catch (error) {
        throw new ApiError(400,error.message || "Unauthorized access");
       }
})