import { Router } from "express";
import {createComment,getAllComments,editComment,deleteComment} from "../controllers/comment.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js';

const router = Router();
router.use(verifyJWT);

router.route("/:videoId").post(createComment).get(getAllComments).patch(editComment).delete(deleteComment);

export default router;