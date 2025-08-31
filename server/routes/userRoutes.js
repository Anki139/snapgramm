import express from 'express'
import { acceptConnectionRequest, discoverUsers, followUsers, getUserConnection, getUserData, getUserProfile, sendConnectionRequest, unfollowUser, updateUserData } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../configs/multer.js';
import { getRecentMessages } from '../controllers/messageController.js';

const userRouter = express.Router();
userRouter.get('/data',protect , getUserData)

userRouter.post('/update', upload.fields([{name:'profile' , maxCount:1},
    {name:'cover' , maxCount:1}, ]),protect , updateUserData)

userRouter.post('/discover',protect , discoverUsers)
userRouter.post('/follow',protect , followUsers)
userRouter.post('/unfollow',protect , unfollowUser)
userRouter.post('/connect',protect,sendConnectionRequest )
userRouter.post('/accept',protect,acceptConnectionRequest )
userRouter.get('/connection',protect,getUserConnection )
userRouter.post('/profile/',protect, getUserProfile)
userRouter.get('/recent-messages',protect, getRecentMessages)

export default userRouter


