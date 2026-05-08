import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "customlocator-css",
  tests: "../tests/customLocator/shorthand.test.ts",
  require: ["tsx/cjs"],
  output: "../output/customlocator-css",

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
      strategy: "css",
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
