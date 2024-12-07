import pool from '../config/database.js';

export default {
  async create(trainData) {
    const query = `
      INSERT INTO trains (name, source, destination, total_seats, available_seats, departure_time, arrival_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      trainData.name,
      trainData.source,
      trainData.destination,
      trainData.totalSeats,
      trainData.totalSeats,
      trainData.departureTime,
      trainData.arrivalTime
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async seatCount(trainId) {
    try {
      await pool.query('BEGIN');
  
      const query = `
        SELECT available_seats 
        FROM trains 
        WHERE id = $1
        FOR UPDATE
      `;
      const { rows } = await pool.query(query, [trainId]);
  
      await pool.query('COMMIT');
  
      return rows[0].available_seats; 
    } catch (error) {
      await pool.query('ROLLBACK'); 
      throw error; 
    } finally {
      pool.release(); 
    }
  }
  ,

  async findByRoute(source, destination) {
    const query = `
      SELECT * FROM trains 
      WHERE source = $1 AND destination = $2
      AND departure_time > NOW()
    `;
    const { rows } = await pool.query(query, [source, destination]);
    return rows;
  },

  async updateSeats(trainId, seatsToBook) {
    const pool = await pool.connect();
    try {
      await pool.query('BEGIN');
      
      // Get current seats with row lock
      const checkQuery = `
        SELECT available_seats 
        FROM trains 
        WHERE id = $1 
        FOR UPDATE
      `;
      const { rows } = await pool.query(checkQuery, [trainId]);
      
      if (rows[0].available_seats < seatsToBook) {
        throw new Error('Not enough seats available');
      }

      // Update seats
      const updateQuery = `
        UPDATE trains 
        SET available_seats = available_seats - $1
        WHERE id = $2
        RETURNING *
      `;
      const result = await pool.query(updateQuery, [seatsToBook, trainId]);
      
      await pool.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    } finally {
      pool.release();
    }
  }
};