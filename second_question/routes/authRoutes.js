import express from 'express';
import { otpForResetPassword, verifyOtpForResetPassword } from '../controller/authController.js';


//router object 
const router = express.Router();



// Send otp for reset password || POST
router.post('/otp-for-reset-password', otpForResetPassword)

// verify otp for reset password || POST
router.post('/verify-otp-for-reset-password', verifyOtpForResetPassword)


export default router;