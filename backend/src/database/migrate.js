const fs = require('fs');
const path = require('path');
const pool = require('./config');

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database migrations...');
    
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id          SERIAL      PRIMARY KEY,
        filename    TEXT        NOT NULL UNIQUE,
        applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure order
    
    // Get already applied migrations
    const { rows: appliedMigrations } = await client.query(
      'SELECT filename FROM migrations'
    );
    const appliedFilenames = appliedMigrations.map(row => row.filename);
    
    // Apply pending migrations
    for (const filename of migrationFiles) {
      if (!appliedFilenames.includes(filename)) {
        console.log(`Applying migration: ${filename}`);
        
        const migrationPath = path.join(migrationsDir, filename);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        // Run the migration
        await client.query(migrationSQL);
        
        // Record the migration as applied
        await client.query(
          'INSERT INTO migrations (filename) VALUES ($1)',
          [filename]
        );
        
        console.log(`✓ Applied migration: ${filename}`);
      } else {
        console.log(`- Skipping already applied migration: ${filename}`);
      }
    }
    
    console.log('Database migrations completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migrations completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration error:', error);
      process.exit(1);
    });
}

module.exports = runMigrations; 