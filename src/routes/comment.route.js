import { Router } from "express";
import {createComment,getAllComments} from "../controllors/comment.controllor.js";
import {verifyJWT} from '../middelware/auth.middelware.js';

const router = Router();
router.use(verifyJWT);

router.route("/:videoId").post(createComment).get(getAllComments).patch(editComment).delete(deleteComment);

export default router;