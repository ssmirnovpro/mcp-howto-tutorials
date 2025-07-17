// Test setup file
import { jest } from '@jest/globals';

// Mock console.error to avoid cluttering test output
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Set test environment variables
process.env.TODO_DB_PATH = ':memory:';
process.env.NODE_ENV = 'test';
