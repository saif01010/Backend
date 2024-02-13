import { Router } from "express";
import { registerUser, loginUser,logoutUser ,refreshTokenEndPoint} from "../controllors/user.controller.js";
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

export default router;