import dotenv from 'dotenv';

// Load environment variables for testing
dotenv.config({ path: '.env.test' });

// Global test configuration
process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test'; 