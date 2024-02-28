import {Router} from 'express';
import {toggleSubscriber,getUserChannelSubscribers,getSubscribedChannels} from '../controllers/subscription.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);


router.route('/:channelId').post(toggleSubscriber).get(getUserChannelSubscribers);
router.route('/get/:subscriberId').get(getSubscribedChannels);

export default router;