# Allakando Mini - Tutoring Platform

A monorepo for the Allakando tutoring platform with Node.js backend, React frontend, and PostgreSQL database.

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
├── frontend/          # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── lib/       # API client and utilities
│   │   └── components/# UI components
│   ├── package.json
│   └── README.md
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your database credentials

# Create PostgreSQL database
createdb allakando_db

# Start the server
npm start
```

The backend will run on `http://localhost:3000` and automatically apply database migrations.

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173` and connect to the backend API.

### 3. Using Docker (Alternative)

```bash
# Start PostgreSQL with Docker
cd backend
docker-compose up -d postgres

# Start backend (in another terminal)
cd backend
npm install
npm start

# Start frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## Features

### Backend
- **Express.js** REST API with all required endpoints
- **PostgreSQL** database with automatic migrations
- **CORS** enabled for frontend integration
- **UUID** primary keys for all entities
- **Transaction support** for booking operations
- **Constraint validation** (unique emails, time overlaps, etc.)

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Query** for API state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Sonner** for toast notifications

## API Endpoints

Base URL: `http://localhost:3000/v1`

- `GET /tutors` - List all tutors
- `POST /tutors` - Create a tutor
- `POST /tutors/:id/availability` - Add availability slot
- `GET /tutors/:id/availability` - List available slots
- `POST /students` - Create a student
- `POST /bookings` - Book a slot
- `GET /bookings?student_id={id}` - List student bookings

## Frontend Pages

- **Home** - Overview dashboard with statistics and quick actions
- **Tutors** - Manage tutors and their availability slots
- **Students** - Create and manage student accounts
- **Bookings** - Create bookings and view booking history

## Database Schema

The database includes four main tables:

1. **tutors** - Tutor information (id, name, email, created_at)
2. **students** - Student information (id, name, email, created_at)
3. **availability_slots** - Tutor availability slots (id, tutor_id, start_time, end_time, is_booked, created_at)
4. **bookings** - Student bookings (id, slot_id, student_id, booked_at)

All tables use UUID primary keys and include proper foreign key relationships and constraints.

## Development Workflow

### Backend Development
- Automatic migrations run on server startup
- Hot reload with nodemon in development
- Comprehensive error handling
- CORS enabled for frontend integration

### Frontend Development
- Hot reload with Vite
- TypeScript for type safety
- React Query for efficient API calls
- Responsive design with Tailwind CSS

### Adding New Features
1. Create new migration files for database changes
2. Add new routes in `backend/src/routes/`
3. Create new pages in `frontend/src/pages/`
4. Update API client in `frontend/src/lib/api.ts`

## Testing the Application

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Open the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/v1

3. **Test the workflow:**
   - Create a tutor on the Tutors page
   - Add availability slots for the tutor
   - Create a student on the Students page
   - Create a booking on the Bookings page

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in environment variables
2. Use a production PostgreSQL instance
3. Configure proper CORS settings
4. Set up reverse proxy (nginx, etc.)
5. Use PM2 or similar process manager

### Frontend
1. Build the application: `npm run build`
2. Serve static files with nginx or similar
3. Configure environment variables for production API URL

## Next Steps

- [ ] Add authentication and authorization
- [ ] Implement real-time notifications
- [ ] Add comprehensive testing
- [ ] Set up CI/CD pipeline
- [ ] Add payment integration
- [ ] Implement video calling features 