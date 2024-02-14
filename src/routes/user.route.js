import { Router } from "express";
import { registerUser, loginUser,
    logoutUser ,refreshTokenEndPoint,
    avatarUpdate,coverImageUpdate,
    changeCurrentPassword,updateUserInformation,
    getCurrentUser,getChannelProfile} from "../controllors/user.controller.js";
import {upload} from '../middelware/mutler.middelware.js';
import {verifyJWT} from '../middelware/auth.middelware.js';

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ])
    ,registerUser);

router.route("/login").post(loginUser);
//secure route
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshTokenEndPoint)
router.route("/update-avatar").post(verifyJWT,upload.single("avatar"),avatarUpdate);
router.route("/update-coverimage").post(verifyJWT,upload.single("coverImage"),coverImageUpdate);
router.route("/update-information").post(verifyJWT,updateUserInformation)
router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/update-password").post(verifyJWT,changeCurrentPassword);
router.route("/c/:username").get(verifyJWT,getChannelProfile)
export default router;