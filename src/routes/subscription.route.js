import {Router} from 'express';
import {toggleSubscriber} from '../controllors/subscription.controllor.js';
import {verifyJWT} from '../middelware/auth.middelware.js';

const router = Router();

router.use(verifyJWT);


router.route('/:channelId').post(toggleSubscriber);

export default router;