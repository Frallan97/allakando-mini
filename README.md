# Allakando Mini - Tutoring Platform

A monorepo for the Allakando tutoring platform with Node.js backend, frontend, and PostgreSQL database.

## Project Structure

```
allakando-mini/
├── backend/           # Node.js API server
│   ├── src/
│   │   ├── database/  # Database config and migrations
│   │   ├── routes/    # API route handlers
│   │   └── server.js  # Main server file
│   ├── package.json
│   ├── docker-compose.yml
│   └── README.md
├── frontend/          # Frontend application (to be added)
└── README.md
```

## Backend

The backend is a Node.js Express API with PostgreSQL database and automatic migrations.

### Features
- RESTful API with all required endpoints
- PostgreSQL database with UUID primary keys
- Automatic database migrations on startup
- Transaction support for booking operations
- Constraint validation (unique emails, time overlaps)
- Docker support for easy development

### Quick Start with Docker

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Start with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Test the API:**
   ```bash
   curl http://localhost:3000/health
   ```

### Manual Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

3. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE allakando_db;
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

### API Endpoints

Base URL: `http://localhost:3000/v1`

- `GET /tutors` - List all tutors
- `POST /tutors` - Create a tutor
- `POST /tutors/:id/availability` - Add availability slot
- `GET /tutors/:id/availability` - List available slots
- `POST /students` - Create a student
- `POST /bookings` - Book a slot
- `GET /bookings?student_id={id}` - List student bookings

See [backend/README.md](backend/README.md) for detailed API documentation.

## Database Schema

The database includes four main tables:

1. **tutors** - Tutor information
2. **students** - Student information  
3. **availability_slots** - Tutor availability slots
4. **bookings** - Student bookings

All tables use UUID primary keys and include proper foreign key relationships and constraints.

## Development

### Backend Development
- Automatic migrations run on server startup
- Hot reload with nodemon in development
- Comprehensive error handling
- CORS enabled for frontend integration

### Adding New Features
1. Create new migration files for database changes
2. Add new routes in `backend/src/routes/`
3. Update API documentation

## Next Steps

- [ ] Set up frontend application
- [ ] Add authentication and authorization
- [ ] Implement real-time notifications
- [ ] Add comprehensive testing
- [ ] Set up CI/CD pipeline 