import { Router } from "express";
import {createTweet,getAllTweets,
    deleteTweet} from "../controllors/tweet.controllor.js";
import {verifyJWT} from '../middelware/auth.middelware.js';

const router = Router();

router.use(verifyJWT);

router.route("/add-tweet").post(createTweet);
router.route("/get-tweet").get(getAllTweets);
router.route("/delete-tweet/:tweetId").delete(deleteTweet);

export default router;