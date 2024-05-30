module.exports = {
  preset: "ts-jest",
  projects: [
    {
      displayName: "backend",
      testEnvironment: "node",
      testMatch: ["<rootDir>/tests/backend/**/*.test.ts"],
    },
    {
      displayName: "frontend",
      testEnvironment: "jest-environment-jsdom",
      testMatch: ["<rootDir>/src/frontend/**/*.test.tsx"],
      setupFilesAfterEnv: ["<rootDir>/src/setupTestsFrontend.ts"],
      transform: {
        "^.+\\.tsx?$": "babel-jest",
        "^.+\\.jsx?$": "<rootDir>/node_modules/babel-jest",
      },
      moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
      transformIgnorePatterns: [],
    },
  ],
};
