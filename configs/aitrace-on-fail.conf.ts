import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "aitrace-on-fail",
  tests: "../tests/aiTrace/failing.test.ts",
  require: ["tsx/cjs"],
  output: "../output/aitrace-on-fail",

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
      on: "fail",
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
