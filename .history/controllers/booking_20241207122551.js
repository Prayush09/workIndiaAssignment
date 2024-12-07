import Booking from '../models/booking.js';
import Train from '../models/train.js';
import logger from '../config/logger.js';
import pool from '../config/database.js';

export default {
  async create(req, res) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { trainId, seats } = req.body;
      const userId = req.user.id;

      await Train.updateSeats(trainId, seats);
      
      // Create booking
      const booking = await Booking.create(userId, trainId, seats);
      
      await client.query('COMMIT');
      res.status(201).json(booking);
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Booking creation error:', error);
      res.status(500).json({ message: 'Booking failed' });
    } finally {
      client.release();
    }
  },

  async getUserBookings(req, res) {
    try {
      const bookings = await Booking.findByUser(req.user.id);
      res.json(bookings);
    } catch (error) {
      logger.error('Get bookings error:', error);
      res.status(500).json({ message: 'Failed to get bookings' });
    }
  },

  async getBooking(req, res) {
    try {
      const booking = await Booking.findById(req.query.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      if (booking.user_id !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied' });
      }
      res.json(booking);
    } catch (error) {
      logger.error('Get booking error:', error);
      res.status(500).json({ message: 'Failed to get booking' });
    }
  }
};