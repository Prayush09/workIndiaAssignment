import Train from '../models/train.js';
import Booking from '../models/booking.js';
import User from '../models/user.js';
import logger from '../config/logger.js';
import pool from '../config/database.js';

export default {
  // Train Management
  async getAllTrains(req, res) {
    try {
      const query = `
        SELECT *, 
          (total_seats - available_seats) as booked_seats,
          (SELECT COUNT(*) FROM bookings WHERE train_id = trains.id) as total_bookings
        FROM trains
        ORDER BY departure_time DESC
      `;
      const { rows } = await pool.query(query);
      res.json(rows);
    } catch (error) {
      logger.error('Get all trains error:', error);
      res.status(500).json({ message: 'Failed to fetch trains' });
    }
  },

  async deleteTrain(req, res) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check for existing bookings
      const bookingsQuery = 'SELECT COUNT(*) FROM bookings WHERE train_id = $1';
      const { rows } = await client.query(bookingsQuery, [req.params.trainId]);
      
      if (rows[0].count > 0) {
        throw new Error('Cannot delete train with existing bookings');
      }

      // Delete train
      const deleteQuery = 'DELETE FROM trains WHERE id = $1 RETURNING *';
      const result = await client.query(deleteQuery, [req.params.trainId]);
      
      if (result.rows.length === 0) {
        throw new Error('Train not found');
      }

      await client.query('COMMIT');
      res.json({ message: 'Train deleted successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Delete train error:', error);
      res.status(error.message.includes('not found') ? 404 : 400)
        .json({ message: error.message });
    } finally {
      client.release();
    }
  },

  // Booking Management
  async getAllBookings(req, res) {
    try {
      const query = `
        SELECT b.*, 
          u.name as user_name, u.email as user_email,
          t.name as train_name, t.source, t.destination,
          t.departure_time, t.arrival_time
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN trains t ON b.train_id = t.id
        ORDER BY b.booking_date DESC
      `;
      const { rows } = await pool.query(query);
      res.json(rows);
    } catch (error) {
      logger.error('Get all bookings error:', error);
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  },

  async cancelBooking(req, res) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update booking status
      const updateBookingQuery = `
        UPDATE bookings 
        SET status = 'CANCELLED'
        WHERE id = $1
        RETURNING *
      `;
      const bookingResult = await client.query(updateBookingQuery, [req.params.bookingId]);
      
      if (bookingResult.rows.length === 0) {
        throw new Error('Booking not found');
      }

      const booking = bookingResult.rows[0];

      // Return seats to train
      const updateTrainQuery = `
        UPDATE trains
        SET available_seats = available_seats + $1
        WHERE id = $2
      `;
      await client.query(updateTrainQuery, [booking.seats, booking.train_id]);

      await client.query('COMMIT');
      res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Cancel booking error:', error);
      res.status(error.message.includes('not found') ? 404 : 500)
        .json({ message: error.message });
    } finally {
      client.release();
    }
  },

  // Analytics
  async getDashboardStats(req, res) {
    try {
      const stats = await Promise.all([
        // Total active trains
        pool.query(`
          SELECT COUNT(*) as total_trains,
            SUM(total_seats) as total_seats,
            SUM(total_seats - available_seats) as booked_seats
          FROM trains
          WHERE departure_time > NOW()
        `),
        
        // Today's bookings
        pool.query(`
          SELECT COUNT(*) as today_bookings,
            SUM(seats) as seats_booked_today
          FROM bookings
          WHERE DATE(booking_date) = CURRENT_DATE
        `),
        
        // Popular routes
        pool.query(`
          SELECT source, destination, COUNT(*) as trip_count
          FROM trains
          GROUP BY source, destination
          ORDER BY trip_count DESC
          LIMIT 5
        `)
      ]);

      res.json({
        trainStats: stats[0].rows[0],
        bookingStats: stats[1].rows[0],
        popularRoutes: stats[2].rows
      });
    } catch (error) {
      logger.error('Dashboard stats error:', error);
      res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
  }
};