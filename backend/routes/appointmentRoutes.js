import express from 'express';
import {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  approveAppointment,
  completeAppointment,
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', bookAppointment);
router.get('/', getAppointments);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/approve', authorize('admin'), approveAppointment);
router.put('/:id/complete', authorize('admin'), completeAppointment);

export default router;
