import {Router} from 'express';
import {toggleLikeVideo,toggleLikeComment,toggleLikeTweet} from '../controllors/like.controllor.js';
import {verifyJWT} from '../middelware/auth.middelware.js';

const router = Router();

router.use(verifyJWT);

router.route("/toggle-like-v/:videoId").patch(toggleLikeVideo);
router.route("/toggle-like-c/:commentId").patch(toggleLikeComment);
router.route("/toggle-like-t/:tweetId").patch(toggleLikeTweet);

export default router;