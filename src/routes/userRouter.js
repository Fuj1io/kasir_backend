import { Router } from 'express';
import { registerUser } from  '../controllers/UserController.js';

const userRouter = Router();

userRouter.post('/register', registerUser);

export default userRouter;
