// Jest setup file
import '@testing-library/jest-dom';

// Mock fetch globally
(global as any).fetch = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
}); 