import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "screencast-http",
  tests: "../tests/screencast/**/*.test.ts",
  require: ["tsx/cjs"],
  output: "../output/screencast-http",

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
    screencast: {
      enabled: true,
      on: "fail",
    },
    screenshot: { enabled: false },
    retryFailedStep: { enabled: false },
  },

  include: {},
};
