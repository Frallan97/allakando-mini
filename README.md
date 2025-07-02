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
│   ├── tests
│   ├── package.json
│   ├── docker-compose.yml
│   └── README.md
├── frontend/          # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── lib/       # API client and utilities
│   │   ├── test/       # Tests
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

### Backend And Database Setup

```bash
cd backend
npm install  # or: bun install

cp env.example .env
# Edit .env with your database credentials

# Set up the postgres db
docker compose up -d --build

# Start the backend
npm start    # or: bun start
```

Backend runs on `http://localhost:3000` with automatic migrations.

### Frontend Setup

```bash
cd frontend
npm install  # or: bun install
npm run dev  # or: bun dev
```

Frontend runs on `http://localhost:8080`.


## Features

**Backend:** Express.js REST API, PostgreSQL with migrations, CORS, UUID keys, transactions, constraints

**Frontend:** React 18 + TypeScript, Vite, React Query, React Router, Tailwind CSS, shadcn/ui, Sonner

**Error Handling:** Comprehensive error handling with custom error types, user-friendly messages, retry logic, and error boundaries

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


## Next Steps

- [ ] Authentication & authorization
- [ ] Real-time notifications
- [X] Comprehensive testing
- [ ] CI/CD pipeline
- [ ] Payment integration
- [ ] Video calling 

## Error Handling

The frontend includes a robust error handling system:

### Error Types
- **APIError**: For HTTP errors with status codes and details
- **NetworkError**: For connection failures
- **ValidationError**: For form validation errors

### Error Handling Hooks
- **useErrorHandler**: For handling errors with toast notifications
- **useAsyncErrorHandler**: For wrapping async operations with error handling

### Components
- **ErrorBoundary**: Catches React errors and displays user-friendly messages
- **LoadingErrorState**: Reusable component for loading and error states

### Usage Example
```tsx
import { useErrorHandler } from '@/hooks/useErrorHandler';

const MyComponent = () => {
  const { handleError } = useErrorHandler({ context: 'MyComponent' });
  
  const handleSubmit = async () => {
    try {
      await api.createSomething(data);
    } catch (error) {
      handleError(error, 'Failed to create item');
    }
  };
};
``` 