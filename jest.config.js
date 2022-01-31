module.exports = {
  testEnvironment: "node",
  transform: { "^.+\\.ts$": "ts-jest" },
  moduleFileExtensions: ["js", "mjs", "ts"],
  transformIgnorePatterns: [],
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "./coverage",
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
    "<rootDir>/types/",
  ],
};
