
---

# Train Booking System Documentation 📚

---

## Table of Contents

1. **Project Overview**
2. **Environment Setup** 📁
3. **Installing Dependencies** 🔌
4. **Database Configuration** 🗃️
5. **Folder Structure** 🗂️
6. **API Endpoints** 🚀
7. **Controllers** 📜
    - **Admin Controller**  
    - **Auth Controller**  
    - **Booking Controller**  
    - **Train Controller**  
8. **Running the Project** ▶️
9. **Common Issues and Troubleshooting** ❓
10. **Useful Links** 🔗

---

## 🚀 Project Overview

This project is a **Train Booking System** that allows users to:

- Book train tickets.
- Search for trains by source and destination.
- Manage bookings and view booking history.
- Admins can create, delete, and manage trains and bookings.
- Dashboard analytics displaying active trains, booking statistics, and popular routes.

---

## 🔧 Environment Setup

### Requirements 📜

- Node.js (v14+)
- PostgreSQL (v12+)
- npm
- dotenv
- JWT
- Bcrypt
- Other dependencies (listed below)

### 1. Clone the Project Repository

```bash
git clone https://github.com/your-repository/train-booking-system.git
```

---

### 2. Install Dependencies 📜

Navigate to your project directory:

```bash
cd train-booking-system
```

Install project dependencies:

```bash
npm install
```

---

### 3. Setup Environment Variables 📄

Create a `.env` file in the root directory and add the following environment variables:

```plaintext
# .env file

# Database Configuration
HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=train_booking

# JWT Secret Key
JWT_SECRET=your_secret_key

# Admin API Key
ADMIN_API_KEY=your_admin_api_key
```

---

### 4. Configure PostgreSQL Database 🗃️

1. Ensure PostgreSQL is installed on your system.
2. Create a database:

```sql
CREATE DATABASE train_booking;
```

3. Ensure the database connection details are correctly set in the `.env` file.

4. Run the following commands to initialize your database schema:

```bash
npx knex migrate:latest
```

---

## 📂 Project Folder Structure

Here's a breakdown of the project folder structure:

```
train-booking-system/
├── config/
│   ├── database.js
│   ├── logger.js
├── models/
│   ├── train.js
│   ├── booking.js
│   ├── user.js
├── controllers/
│   ├── admin.js
│   ├── auth.js
│   ├── booking.js
│   ├── train.js
├── routes/
├── .env
├── package.json
├── server.js
├── knexfile.js
└── README.md
```

---

## 📜 Controllers

Here's a breakdown of the provided controllers.

---

### **1. Admin Controller (`controllers/admin.js`)**

This controller handles the administration functions.

#### **`getAllTrains`**
- **Purpose:** Fetch a list of all trains with booking statistics.
- **API:** GET `/api/admin/trains`

```javascript
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
}
```

#### **`deleteTrain`**
- **Purpose:** Deletes a train if no active bookings exist.
- **API:** DELETE `/api/admin/trains/:trainId`

---

#### **`getAllBookings`**
- **Purpose:** Lists all train bookings along with user and train details.
- **API:** GET `/api/admin/bookings`

---

#### **`cancelBooking`**
- **Purpose:** Cancels a booking and updates train seat availability.
- **API:** DELETE `/api/admin/bookings/:bookingId`

---

### **2. Auth Controller (`controllers/auth.js`)**

Handles user authentication and registration.

#### **`register`**
- **Purpose:** Registers a new user with an optional admin key.
- **API:** POST `/api/auth/register`

---

#### **`login`**
- **Purpose:** Logs in users and returns a JWT token.
- **API:** POST `/api/auth/login`

---

### **3. Booking Controller (`controllers/booking.js`)**

Handles booking operations for users.

#### **`create`**
- **Purpose:** Books a train ticket by deducting seats.
- **API:** POST `/api/booking`

---

#### **`getUserBookings`**
- **Purpose:** Fetch all bookings associated with a user's ID.
- **API:** GET `/api/booking/user`

---

#### **`getBooking`**
- **Purpose:** Retrieves a single booking by booking ID.
- **API:** GET `/api/booking/:id`

---

### **4. Train Controller (`controllers/train.js`)**

Handles operations for creating and searching trains.

---

#### **`create`**
- **Purpose:** Creates a new train record.
- **API:** POST `/api/train`

---

#### **`updateSeats`**
- **Purpose:** Updates the number of available seats on a train.
- **API:** PUT `/api/train/:trainId/seats`

---

### **`search`**
- **Purpose:** Searches trains based on source and destination.
- **API:** POST `/api/train/search`

---

## ▶️ Running the Project Locally

1. Start the backend server:

```bash
npm run dev
```

This should start your server on port `5000`.

2. Ensure PostgreSQL is running and accessible.

3. Use Postman or any API testing tool to interact with the endpoints.

---

## ❓ Common Issues & Troubleshooting

### 1. **Database Connection Error**
- **Solution:**  
  Ensure PostgreSQL is running and the database name, host, port, username, and password are correctly set in your `.env` file.

### 2. **JWT Authentication Errors**
- **Solution:**  
  Check if `JWT_SECRET` is correctly set in your `.env` file.

### 3. **Admin Key Validation**
- **Solution:**  
  Ensure your `ADMIN_API_KEY` in the `.env` matches the expected value.

---

## 🔗 Useful Links
- **PostgreSQL Documentation:** [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)
- **Node.js Documentation:** [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)
- **JWT Docs:** [https://jwt.io](https://jwt.io)

---

This documentation should guide you through setting up your train booking system backend, connecting it to PostgreSQL, and interacting with the provided API endpoints for booking and administration functionalities.