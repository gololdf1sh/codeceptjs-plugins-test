import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "aitrace-keep-all",
  tests: "../tests/aiTrace/{passing,failing}.test.ts",
  require: ["tsx/cjs"],
  output: "../output/aitrace-keep-all",

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
      deleteSuccessful: false,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
