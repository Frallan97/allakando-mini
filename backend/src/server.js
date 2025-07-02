const express = require('express');
const cors = require('cors');
require('dotenv').config();

const runMigrations = require('./database/migrate');
const tutorsRouter = require('./routes/tutors');
const studentsRouter = require('./routes/students');
const bookingsRouter = require('./routes/bookings');
const availabilityRouter = require('./routes/availability');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/v1/tutors', tutorsRouter);
app.use('/v1/students', studentsRouter);
app.use('/v1/bookings', bookingsRouter);
app.use('/v1/availability', availabilityRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server with migrations
async function startServer() {
  try {
    // Run database migrations first
    await runMigrations();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API base URL: http://localhost:${PORT}/v1`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Export app for testing
module.exports = app;

// Only start server if this file is run directly
if (require.main === module) {
  startServer();
} 