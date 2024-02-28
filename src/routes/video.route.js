import {Router} from "express";
import { upload } from "../middlewares/mutler.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideo,getVideoById,
    updateVideo,updateThumbnail,deleteVideo,togglePublishStatus } from "../controllers/video.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/uplaod").post(upload.fields([
    {
        name: "thumbnail",
        maxCount: 1
    },
    {
        name: "videoUrl",
        maxCount: 1
    }
]),uploadVideo);
router.route("/v/:videoId").patch(updateVideo)
.get(getVideoById).delete(deleteVideo);
router.route("/thumbnail/:videoId").post(upload.single("thumbnail"),updateThumbnail);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
export default router;