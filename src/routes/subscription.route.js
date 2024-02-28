import {Router} from 'express';
import {toggleSubscriber} from '../controllers/subscription.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);


router.route('/:channelId').post(toggleSubscriber);

export default router;