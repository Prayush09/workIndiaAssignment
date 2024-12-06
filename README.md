Started off with initializing a new PostgreSQL server, 
Going to create tables as per the requirement: 
    1. User Details (UUID, Name, Number, Gmail, Password);
    2. Admin Details (UUID, Name, Department, Location, API Key, Password)
    3. Train Details (UUID, Name, Source, destination, no_of_seats)
    4. Booking Details (UUID, TrainId, UserId) => all the train info from train details for this UserId

Create models for each table, with CRUD application

After that create services that uses these models.

Create required functionality into these services

Create controllers to re-direct the api calls to these services

Authenticate the whole process and test all the endpoints using postman

If all works then assignment is status code 200, else status code 404
