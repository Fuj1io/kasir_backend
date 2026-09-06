import { Router } from 'express';
import { profileUser , registerUser, loginUser, logOutUser } from  '../controllers/UserController.js';
import { authUser  } from "../middlewares/authUser.js";
import {refreshToken} from "../controllers/refreshToken.js";

const userRouter = Router();

userRouter.get("/refresh", refreshToken);
userRouter.get('/profile/:id_user', authUser, profileUser);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.delete('/logout', logOutUser);

export default userRouter;
