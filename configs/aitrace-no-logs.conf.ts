import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "aitrace-no-logs",
  tests: "../tests/aiTrace/passing.test.ts",
  require: ["tsx/cjs"],
  output: "../output/aitrace-no-logs",

  helpers: {
    Playwright: {
      url: "http://localhost:8787",
      show: false,
      browser: "chromium",
      waitForNavigation: "load",
      windowSize: "1280x720",
    },
  },

  plugins: {
    aiTrace: {
      enabled: true,
      captureBrowserLogs: false,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
