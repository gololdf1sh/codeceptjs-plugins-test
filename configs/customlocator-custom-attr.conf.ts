import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "customlocator-custom-attr",
  tests: "../tests/customLocator/custom-attr.test.ts",
  require: ["tsx/cjs"],
  output: "../output/customlocator-custom-attr",

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
      prefix: "=",
      attribute: "data-qa",
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
