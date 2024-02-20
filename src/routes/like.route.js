import {Router} from 'express';
import {toggleLikeVideo,toggleLikeComment,
    toggleLikeTweet,getAllLikedVideos} from '../controllors/like.controllor.js';
import {verifyJWT} from '../middelware/auth.middelware.js';

const router = Router();

router.use(verifyJWT);

router.route("/toggle-like-v/:videoId").patch(toggleLikeVideo);
router.route("/toggle-like-c/:commentId").patch(toggleLikeComment);
router.route("/toggle-like-t/:tweetId").patch(toggleLikeTweet);
router.route("/liked-videos").get(getAllLikedVideos);

export default router;