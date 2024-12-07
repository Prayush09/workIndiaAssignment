import { Router } from 'express';
import { param } from 'express-validator';
import adminController from '../controllers/admin.js';
import { authenticateToken, isAdmin, validateAdminKey } from '../middleware/auth.js';

const router = Router();

// Middleware for all admin routes
router.use(validateAdminKey);
router.use(authenticateToken);
router.use(isAdmin);

// Train Management
router.get('/trains', adminController.getAllTrains);
router.delete('/trains/:trainId', [
  param('trainId').isInt().withMessage('Invalid train ID')
], adminController.deleteTrain);

// Booking Management
router.get('/bookings', adminController.getAllBookings);
router.post('/bookings/:bookingId/cancel', [
  param('bookingId').isInt().withMessage('Invalid booking ID')
], adminController.cancelBooking);

// Dashboard Stats
router.get('/dashboard/stats', adminController.getDashboardStats);

export default router;