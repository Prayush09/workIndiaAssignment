import { Router } from 'express';
import { body, query } from 'express-validator';
import trainController from '../controllers/train.js';
import { authenticateToken, isAdmin, validateAdminKey } from '../middleware/auth.js';

const router = Router();

router.post('/', [
  validateAdminKey,
  authenticateToken,
  isAdmin,
  body('name').trim().notEmpty(),
  body('source').trim().notEmpty(),
  body('destination').trim().notEmpty(),
  body('totalSeats').isInt({ min: 1 }),
  body('departureTime').isISO8601(),
  body('arrivalTime').isISO8601()
], trainController.create);

router.get('/search', [
  query('source').trim().notEmpty(),
  query('destination').trim().notEmpty()
], trainController.search);

router.get('/seatCount', train)

router.patch('/:trainId/seats', [
  validateAdminKey,
  authenticateToken,
  isAdmin,
  body('seats').isInt({ min: 0 })
], trainController.updateSeats);

export default router;