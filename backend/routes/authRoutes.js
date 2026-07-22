import express from 'express';
import { register, login, logout, getMe, updateProfilePicture } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile-picture', protect, upload.single('image'), updateProfilePicture);

export default router;
