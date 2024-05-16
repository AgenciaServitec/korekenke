import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    roots: ["<rootDir>/src"],
    testMatch: [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    moduleNameMapper: {
      "^firebase-admin/functions$":
        "<rootDir>/node_modules/firebase-admin/lib/functions/index.js",
      "^firebase-admin/firestore$":
        "<rootDir>/node_modules/firebase-admin/lib/firestore/index.js",
      "^firebase-functions/logger":
        "<rootDir>/node_modules/firebase-functions/lib/logger/index.js",
    },
  };
};
