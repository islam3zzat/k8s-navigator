module.exports = {
  preset: "ts-jest",
  projects: [
    {
      displayName: "backend",
      moduleNameMapper: {
        "~/(.*)": "<rootDir>/src/$1",
      },
      testEnvironment: "node",
      testMatch: ["<rootDir>/src/backend/tests/**/*.test.ts"],
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
