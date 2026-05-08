import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "customlocator-multi-attr",
  tests: "../tests/customLocator/multi-attr.test.ts",
  require: ["tsx/cjs"],
  output: "../output/customlocator-multi-attr",

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
      attribute: ["data-test-id", "data-qa"],
      strategy: "xpath",
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
