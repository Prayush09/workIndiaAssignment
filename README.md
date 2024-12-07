
---

# IRCTC Documentation 📚

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

This project is **IRCTC CLONE** that allows users to:

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
git clone https://github.com/Prayush09/workIndiaAssignment.git
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

### 4. **Configuring PostgreSQL Database Schema** 🗃️

This section sets up the PostgreSQL database schema to manage IRCTC. It includes creating **tables** and **data types** to support essential functionalities like **users, trains**, and **bookings**.
---

## 🔍 **Step 1: Define Custom Data Types**

### 📌 **User Role ENUM**

```sql
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
```
- **Purpose**: Defines a custom ENUM type called `user_role`.
- **Values**:
  - `'USER'`: A normal system user.
  - `'ADMIN'`: An administrative user with special privileges.
- PostgreSQL ENUM ensures that only valid roles (`'USER'` or `'ADMIN'`) can be stored in the database, maintaining data integrity.

---

### 📌 **Booking Status ENUM**

```sql
CREATE TYPE booking_status AS ENUM ('CONFIRMED', 'CANCELLED');
```
- **Purpose**: Defines a custom ENUM type called `booking_status`.
- **Values**:
  - `'CONFIRMED'`: Booking is confirmed.
  - `'CANCELLED'`: Booking has been cancelled.
- This ensures that only valid statuses are stored in the `bookings` table, maintaining clarity and consistency.

---

## 📝 **Step 2: Create the Tables**

### 📅 **1. Users Table**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Explanation**:

| Column      | Description |
|--------------|-------------|
| `id`         | **Primary Key**: Automatically increments for each user. |
| `name`       | User's full name (cannot be null). |
| `email`      | Unique identifier for a user. |
| `password`   | User's password (stored in a hashed format). |
| `role`       | Defines user role, either `'USER'` or `'ADMIN'`. Default is `'USER'`. |
| `created_at` | Stores the registration timestamp. |

- The `email` field is **unique** to prevent duplicate accounts.
- The `role` column uses the `user_role` ENUM type to store valid user roles.

---

### 🚆 **2. Trains Table**

```sql
CREATE TABLE trains (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  source VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  total_seats INTEGER NOT NULL,
  available_seats INTEGER NOT NULL,
  departure_time TIMESTAMP NOT NULL,
  arrival_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Explanation**:

| Column          | Description |
|-----------------|-------------|
| `id`            | **Primary Key**: Auto-incremented identifier for each train. |
| `name`          | Train's name (e.g., "Express 101"). |
| `source`        | Train's starting location. |
| `destination`   | Train's destination location. |
| `total_seats`   | Total number of seats available on the train. |
| `available_seats` | Number of currently available seats. |
| `departure_time` | When the train departs. |
| `arrival_time`   | When the train arrives. |
| `created_at`    | Automatically stores the train creation timestamp. |

- This schema ensures details about **source, destination**, and **seat availability** are accurately stored and retrieved.

---

### 📅 **3. Bookings Table**

```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  train_id INTEGER REFERENCES trains(id),
  seats INTEGER NOT NULL,
  status booking_status DEFAULT 'CONFIRMED',
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Explanation**:

| Column         | Description |
|----------------|-------------|
| `id`            | **Primary Key**: Unique booking identifier. |
| `user_id`      | Foreign key linking to the `users` table. |
| `train_id`     | Foreign key linking to the `trains` table. |
| `seats`        | Number of seats booked. |
| `status`       | Booking status: `'CONFIRMED'` or `'CANCELLED'`. Default is `'CONFIRMED'`. |
| `booking_date`  | Automatically records the booking creation timestamp. |

- **Foreign Keys**:
  - `user_id` → References the `id` column in the `users` table.
  - `train_id` → References the `id` column in the `trains` table.
- These relationships maintain **referential integrity**, ensuring data consistency across the system.

---

### 📝 **Step 3: Indexing**

```sql
CREATE INDEX idx_trains_route ON trains(source, destination);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_trains_departure ON trains(departure_time);
```

### **Explanation of Indexes**

1. **Train Route Index**
```sql
CREATE INDEX idx_trains_route ON trains(source, destination);
```
- **Purpose**: Creates an index on `source` and `destination`.
- **Benefit**: Speeds up queries that search for trains based on **routes**, such as retrieving trains traveling from **city A to city B**.

2. **Booking User Index**
```sql
CREATE INDEX idx_bookings_user ON bookings(user_id);
```
- **Purpose**: Creates an index on the `user_id` column.
- **Benefit**: Faster retrieval of all bookings made by a specific user.

3. **Train Departure Time Index**
```sql
CREATE INDEX idx_trains_departure ON trains(departure_time);
```
- **Purpose**: Improves the performance of queries that search for trains based on **departure time**, allowing quick lookups.

---

### 🔍 **Key Takeaways**

- **Data Types**: PostgreSQL `ENUM` ensures consistent values for `user roles` and `booking statuses`.
- **Tables**: The tables cover essential functionalities for managing **users, trains**, and **bookings**.
- **Indexes**: Improve query performance, ensuring fast retrieval of search and filter operations.

---

## 📂 Project Folder Structure

Here's a breakdown of the project folder structure:

```
Irctc/
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
│   ├── auth.js
│   ├── booking.js
│   ├── train.js
│   ├── admin.js
├── .env
├── package.json
├── server.js
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

This should start your server on port `3000`.

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

Thank you for taking a quick look at this project, please ping me at prayushgiri@gmail.com if you find any bug in the backend, or have any exciting updates regarding the same!