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
- Node.js (v18+) or Bun (v1.0+)
- PostgreSQL (v12+)
- npm or bun

### Backend Setup

```bash
cd backend
npm install  # or: bun install

cp env.example .env
# Edit .env with your database credentials

createdb allakando_db
npm start    # or: bun start
```

Backend runs on `http://localhost:3000` with automatic migrations.

### Frontend Setup

```bash
cd frontend
npm install  # or: bun install
npm run dev  # or: bun dev
```

Frontend runs on `http://localhost:5173`.

### Docker Alternative

```bash
cd backend
docker-compose up -d postgres

# Terminal 1: Backend
cd backend && npm install && npm start
# or: cd backend && bun install && bun start

# Terminal 2: Frontend  
cd frontend && npm install && npm run dev
# or: cd frontend && bun install && bun dev
```

## Features

**Backend:** Express.js REST API, PostgreSQL with migrations, CORS, UUID keys, transactions, constraints

**Frontend:** React 18 + TypeScript, Vite, React Query, React Router, Tailwind CSS, shadcn/ui, Sonner

## API Endpoints

Base: `http://localhost:3000/v1`

- `GET /tutors` - List tutors
- `POST /tutors` - Create tutor
- `POST /tutors/:id/availability` - Add availability
- `GET /tutors/:id/availability` - List slots
- `POST /students` - Create student
- `POST /bookings` - Book slot
- `GET /bookings?student_id={id}` - List bookings

## Pages

- **Home** - Dashboard with stats
- **Tutors** - Manage tutors & availability
- **Students** - Student accounts
- **Bookings** - Create & view bookings

## Database Schema

- **tutors** (id, name, email, created_at)
- **students** (id, name, email, created_at)
- **availability_slots** (id, tutor_id, start_time, end_time, is_booked, created_at)
- **bookings** (id, slot_id, student_id, booked_at)

All use UUID primary keys with proper foreign keys and constraints.

## Development

**Backend:** Auto migrations, hot reload, error handling, CORS
**Frontend:** Hot reload, TypeScript, React Query, Tailwind

**Adding Features:**
1. Create migration files
2. Add routes in `backend/src/routes/`
3. Create pages in `frontend/src/pages/`
4. Update API client in `frontend/src/lib/api.ts`

## Testing

### Backend Tests

```bash
cd backend
npm test
# or: bun test
```

### Frontend Tests

```bash
cd frontend
npm test
# or: bun test
```

### Run All Tests

```bash
# Terminal 1: Backend tests
cd backend && npm test

# Terminal 2: Frontend tests  
cd frontend && npm test
```

## Manual Testing

Open http://localhost:5173 and test the workflow:
1. Create tutor → Add availability → Create student → Create booking

## Production

**Backend:** Set `NODE_ENV=production`, production PostgreSQL, CORS, reverse proxy, PM2

**Frontend:** `npm run build` (or `bun run build`), serve with nginx, configure API URL

## Next Steps

- [ ] Authentication & authorization
- [ ] Real-time notifications
- [ ] Comprehensive testing
- [ ] CI/CD pipeline
- [ ] Payment integration
- [ ] Video calling 