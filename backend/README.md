# Allakando Backend API

A Node.js backend API for the Allakando tutoring platform with PostgreSQL database and automatic migrations.

## Features

- **Express.js** REST API
- **PostgreSQL** database with automatic migrations
- **CORS** enabled for frontend integration
- **UUID** primary keys for all entities
- **Transaction support** for booking operations
- **Constraint validation** (unique emails, time overlaps, etc.)

## Database Schema

### Tables
- **tutors** - Tutor information (id, name, email, created_at)
- **students** - Student information (id, name, email, created_at)
- **availability_slots** - Tutor availability slots (id, tutor_id, start_time, end_time, is_booked, created_at)
- **bookings** - Student bookings (id, slot_id, student_id, booked_at)

### Constraints
- Unique email addresses for tutors and students
- No overlapping time slots for the same tutor
- End time must be after start time
- One booking per slot (prevents double-booking)

## Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=allakando_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=3000
   NODE_ENV=development
   ```

4. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE allakando_db;
   ```

5. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

The server will automatically run database migrations on startup.

## API Endpoints

### Base URL: `http://localhost:3000/v1`

### Tutors

#### GET /tutors
List all tutors
```bash
curl http://localhost:3000/v1/tutors
```

#### POST /tutors
Create a new tutor
```bash
curl -X POST http://localhost:3000/v1/tutors \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Smith", "email": "alice@example.com"}'
```

#### POST /tutors/:tutor_id/availability
Add availability slot for a tutor
```bash
curl -X POST http://localhost:3000/v1/tutors/{tutor_id}/availability \
  -H "Content-Type: application/json" \
  -d '{"start_time": "2025-07-05T14:00:00Z", "end_time": "2025-07-05T15:00:00Z"}'
```

#### GET /tutors/:tutor_id/availability
List available slots for a tutor
```bash
curl http://localhost:3000/v1/tutors/{tutor_id}/availability
```

### Students

#### POST /students
Create a new student
```bash
curl -X POST http://localhost:3000/v1/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Charlie Learner", "email": "charlie@example.com"}'
```

### Bookings

#### POST /bookings
Book an available slot
```bash
curl -X POST http://localhost:3000/v1/bookings \
  -H "Content-Type: application/json" \
  -d '{"student_id": "student-uuid", "slot_id": "slot-uuid"}'
```

#### GET /bookings?student_id={student_id}
List bookings for a student
```bash
curl "http://localhost:3000/v1/bookings?student_id={student_id}"
```

### Health Check

#### GET /health
Check server status
```bash
curl http://localhost:3000/health
```

## Database Migrations

Migrations are automatically applied when the server starts. The migration system:

- Tracks applied migrations in a `migrations` table
- Runs migrations in alphabetical order
- Only applies new migrations
- Provides detailed logging

### Manual Migration Commands

```bash
# Run migrations manually
npm run migrate

# Create a new migration (if needed)
npm run migrate:create
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate email, double booking, etc.)
- `500` - Internal Server Error

Error responses include a descriptive message:
```json
{
  "error": "Email already exists"
}
```

## Development

### Project Structure
```
backend/
├── src/
│   ├── database/
│   │   ├── config.js          # Database connection
│   │   ├── migrate.js         # Migration runner
│   │   └── migrations/        # SQL migration files
│   ├── routes/
│   │   ├── tutors.js          # Tutor endpoints
│   │   ├── students.js        # Student endpoints
│   │   └── bookings.js        # Booking endpoints
│   └── server.js              # Main server file
├── package.json
├── env.example
└── README.md
```

### Adding New Endpoints

1. Create or modify route files in `src/routes/`
2. Add the route to `src/server.js`
3. Test with curl or your preferred API client

### Database Changes

1. Create a new migration file in `src/database/migrations/`
2. Use the format: `XXX_description.sql` (e.g., `003_add_user_roles.sql`)
3. The migration will be applied automatically on next server start

## Testing the API

You can test the API using curl, Postman, or any HTTP client. Here's a complete workflow:

1. **Create a tutor:**
   ```bash
   curl -X POST http://localhost:3000/v1/tutors \
     -H "Content-Type: application/json" \
     -d '{"name": "Alice Smith", "email": "alice@example.com"}'
   ```

2. **Add availability:**
   ```bash
   curl -X POST http://localhost:3000/v1/tutors/{tutor_id}/availability \
     -H "Content-Type: application/json" \
     -d '{"start_time": "2025-07-05T14:00:00Z", "end_time": "2025-07-05T15:00:00Z"}'
   ```

3. **Create a student:**
   ```bash
   curl -X POST http://localhost:3000/v1/students \
     -H "Content-Type: application/json" \
     -d '{"name": "Charlie Learner", "email": "charlie@example.com"}'
   ```

4. **Book a slot:**
   ```bash
   curl -X POST http://localhost:3000/v1/bookings \
     -H "Content-Type: application/json" \
     -d '{"student_id": "{student_id}", "slot_id": "{slot_id}"}'
   ```

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in environment variables
2. Use a production PostgreSQL instance
3. Configure proper CORS settings
4. Set up reverse proxy (nginx, etc.)
5. Use PM2 or similar process manager
6. Set up proper logging and monitoring 