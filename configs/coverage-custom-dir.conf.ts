import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "coverage-custom-dir",
  tests: "../tests/coverage/basic.test.ts",
  require: ["tsx/cjs"],
  output: "../output/coverage-custom-dir",

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
    coverage: {
      enabled: true,
      outputDir: "../output/my-coverage-report",
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
