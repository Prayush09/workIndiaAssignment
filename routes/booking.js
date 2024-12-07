import { Router } from 'express';
import { body } from 'express-validator';
import bookingController from '../controllers/booking.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', [
  authenticateToken,
  body('trainId').notEmpty(),
  body('seats').isInt({ min: 1 })
], bookingController.create);

router.get('/', authenticateToken, bookingController.getUserBookings);

router.get('/:id', authenticateToken, bookingController.getBooking);

export default router;