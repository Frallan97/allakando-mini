# Testing Documentation

This project now includes comprehensive unit tests for both the backend API and frontend client.

## Backend Tests (Jest + Supertest)

**Location**: `backend/src/__tests__/`
**Test Framework**: Jest with Supertest for API testing
**Coverage**: 24 tests across 3 API routes

### Test Files:
- `tutors.test.js` - Tests for tutor management and availability
- `students.test.js` - Tests for student creation 
- `bookings.test.js` - Tests for booking creation and retrieval

### Running Backend Tests:
```bash
cd backend
npm test           # Run tests once
npm run test:watch # Run tests in watch mode
```

### Test Coverage:
- ✅ Success scenarios for all endpoints
- ✅ Input validation (missing fields, invalid data)
- ✅ Error handling (database errors, constraint violations)
- ✅ Business logic (duplicate emails, slot booking conflicts)

## Frontend Tests (Vitest)

**Location**: `frontend/src/test/`
**Test Framework**: Vitest with mocked fetch API
**Coverage**: 11 tests for API client functions

### Test Files:
- `api.test.ts` - Tests for all API client functions
- `setup.ts` - Test environment setup

### Running Frontend Tests:
```bash
cd frontend
npm test           # Run tests in watch mode
npm run test:run   # Run tests once
```

### Test Coverage:
- ✅ API client functions for tutors, students, and bookings
- ✅ HTTP request/response handling
- ✅ Error scenarios and network failures
- ✅ Request payload validation

## Test Results Summary

**Backend**: ✅ 24/24 tests passing
**Frontend**: ✅ 11/11 tests passing
**Total**: ✅ 35/35 tests passing

The console.error messages in backend tests are expected - they're from error handling tests that intentionally trigger errors to verify proper error responses.