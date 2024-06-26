import { Router } from "express";
import { registerUser, loginUser,
    logoutUser ,refreshTokenEndPoint,
    avatarUpdate,coverImageUpdate,
    changeCurrentPassword,updateUserInformation,
    getCurrentUser,getChannelProfile,
    getWatchHistory,
    getAllUsers} from "../controllers/user.controller.js";
import {upload} from '../middlewares/mutler.middleware.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';


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
  ,registerUser)
//   .get(async(req,res,next)=>{
//     res.render("register")
// });

router.route("/login").post(loginUser,)
// .get( async(req,res,)=>{
//     res.render("login")
// });

router.route("/get-all-users").get(getAllUsers)

//secure route
router.route("/logout").get(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshTokenEndPoint)
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),avatarUpdate);
router.route("/update-coverimage").patch(verifyJWT,upload.single("coverImage"),coverImageUpdate);
 router.route("/update-information").patch(verifyJWT,updateUserInformation)
//  .get(async(req,res)=>{
//     res.render("updateinformation")
// });
router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/update-password").patch(verifyJWT,changeCurrentPassword)
// .get(async(req,res)=>{
//     res.render("resetpassword")
// });
router.route("/c/:username").get(verifyJWT,getChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)
export default router;