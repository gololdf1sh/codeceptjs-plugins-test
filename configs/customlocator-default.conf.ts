import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "customlocator-default",
  tests: "../tests/customLocator/shorthand.test.ts",
  require: ["tsx/cjs"],
  output: "../output/customlocator-default",

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
    customLocator: {
      enabled: true,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
