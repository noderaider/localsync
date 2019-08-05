const pack = require("./package");

const base = {
  // Where to search for tests within.
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },

  testRegex: "(/__tests__/.*|\\.test)\\.tsx?$",
  testPathIgnorePatterns: ["/node_modules/", "/lib/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy"
  },

  // The types of files to get coverage for.
  collectCoverageFrom: [
    "**/*[^.d].{ts,tsx}",
    "!**/node_modules/**",
    "!**/Templates/**"
  ],
  coveragePathIgnorePatterns: [
    ".stories.tsx$",
    "stub-data.ts$",
    "Roslyn.Api.tsx"
  ],
  // The reporters to use... swap "text-summary" to "text" for more detailed console report.
  coverageReporters: ["json", "lcov", "text-summary"],
  // Code coverage thresholds we can bump over time.
  coverageThreshold: {
    global: {
      // Minimum number of uncovered statements allowed.
      statements: 20,
      // Minimum percent of branch coverage.
      branches: 15,
      // Minimum percent of line coverage.
      lines: 15,
      // Minimum percent of functions covered.
      functions: 20
    }
  },
  // This adds warning messages to test logs that turn into noise. Enable during upgrades.
  errorOnDeprecated: false,
  globals: {
    "ts-jest": {
      diagnostics: {
        // Squelch specific diagnostic messages that appear often.
        ignoreCodes: [
          // Kill the esModuleInterop nag messages causing noise / log truncation.
          151001
        ]
      }
    }
  }
};

const baseGlobals = base.globals || {};
const baseGlobalsTsJest = baseGlobals["ts-jest"] || {};

module.exports = {
  ...base,
  setupFilesAfterEnv: ["<rootDir>/../../jestSetup.ts"],
  globals: {
    ...baseGlobals,
    "ts-jest": {
      // Use ts-jest configuration from base definition.
      ...baseGlobalsTsJest,
      tsConfig: "<rootDir>/tsconfig.json"
    }
  },
  name: pack.name,
  displayName: pack.name
};
