import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "customlocator-showactual",
  tests: "../tests/customLocator/shorthand.test.ts",
  require: ["tsx/cjs"],
  output: "../output/customlocator-showactual",

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
      showActual: true,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
