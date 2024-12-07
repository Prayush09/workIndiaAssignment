import pool from '../config/database.js';

export default {
  async create(userId, trainId, seats) {
    const query = `
      INSERT INTO bookings (user_id, train_id, seats, status)
      VALUES ($1, $2, $3, 'CONFIRMED')
      RETURNING *
    `;
    const { rows } = await pool.query(query, [userId, trainId, seats]);
    return rows[0];
  },

  async findByUser(userId) {
    const query = `
      SELECT b.*, t.name as train_name, t.source, t.destination,
             t.departure_time, t.arrival_time
      FROM bookings b
      JOIN trains t ON b.train_id = t.id
      WHERE b.user_id = $1
      ORDER BY b.booking_date DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },

  async findById(bookingId) {
    const query = `
      SELECT b.*, t.name as train_name, t.source, t.destination,
             t.departure_time, t.arrival_time
      FROM bookings b
      JOIN trains t ON b.train_id = t.id
      WHERE b.id = $1
    `;
    const { rows } = await pool.query(query, [bookingId]);
    return rows[0];
  }
};