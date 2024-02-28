import { Router } from "express";
import {createTweet,getAllTweets,
    deleteTweet} from "../controllers/tweet.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route("/add-tweet").post(createTweet);
router.route("/get-tweet").get(getAllTweets);
router.route("/delete-tweet/:tweetId").delete(deleteTweet);

export default router;