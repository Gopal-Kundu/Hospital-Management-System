import express from 'express';
import { getStats, getPatients, deletePatient } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/patients', getPatients);
router.delete('/patients/:id', deletePatient);

export default router;
