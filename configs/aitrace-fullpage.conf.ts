import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "aitrace-fullpage",
  tests: "../tests/aiTrace/passing.test.ts",
  require: ["tsx/cjs"],
  output: "../output/aitrace-fullpage",

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
      fullPageScreenshots: true,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
