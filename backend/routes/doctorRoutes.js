import express from 'express';
import { getDoctors, addDoctor, editDoctor, deleteDoctor } from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getDoctors);
router.post('/', authorize('admin'), addDoctor);
router.put('/:id', authorize('admin'), editDoctor);
router.delete('/:id', authorize('admin'), deleteDoctor);

export default router;
