import { Router } from "express";
import { registerUser } from "../controllors/user.controller.js";
import {upload} from '../middelware/mutler.middelware.js';

const router = Router();

router.route("/register").post(
    upload.fields([{name:"avatar",maxCount:1}
    ,{name:"images",maxCount:1}
])
    ,registerUser);

export default router;