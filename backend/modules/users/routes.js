import UserController from "./controller.js";
import express from 'express'


const router = express.Router()


router.post('/register', UserController.createUser)
router.get('/verify/:token', UserController.verifyEmail)
router.post('/login', UserController.loginUser)
router.post('/password-reset-request', UserController.requestPasswordReset);
router.post('/reset-password/:token', UserController.resetPassword);
/* router.post("/resend-verification", UserController.resendVerificationEmail); */
router.get('/logout', UserController.logoutUser);

export default router


