module.exports = {
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testEnvironment: "node",
  clearMocks: true,

  // Where tests live
  testMatch: ["**/tests/**/*.test.js"],

  // Coverage
  collectCoverage: true,
  collectCoverageFrom: ["routes/**/*.js", "middleware/**/*.js", "!**/node_modules/**"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],

  // Minimum coverage required
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
