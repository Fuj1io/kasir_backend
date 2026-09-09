import { Router } from 'express';
import { profileUser, registerUser, loginUser, logOutUser } from '../controllers/UserController.js';
import { authUser } from "../middlewares/authUser.js";
import { refreshToken } from "../controllers/refreshToken.js";

const userRoute = Router();

userRoute.get("/refresh", refreshToken);
userRoute.get('/profile/:id_user', authUser, profileUser);
userRoute.post('/register', registerUser);
userRoute.post('/login', loginUser);
userRoute.delete('/logout', logOutUser);

export default userRoute;
