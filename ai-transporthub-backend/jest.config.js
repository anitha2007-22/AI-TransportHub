// jest.config.js
module.exports = {
  testEnvironment: "node",
  testMatch:       ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js"],
  coverageDirectory: "coverage",
  setupFilesAfterFramework: [],
  testTimeout: 15000,
};
