import { Router } from "express";
import { registerUser } from "../controllors/user.controller.js";
import {upload} from '../utils/multer.js';

const router = Router();

router.route("/register").post(
    upload.fields([{name:"avatar",maxCount:1}
    ,{name:"images",maxCount:1}
])
    ,registerUser);

export default router;