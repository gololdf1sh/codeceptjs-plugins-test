import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "junitreporter-custom",
  tests: "../tests/screenshot/failing.test.ts",
  require: ["tsx/cjs"],
  output: "../output/junitreporter-custom",

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
    junitReporter: {
      enabled: true,
      outputName: "custom-report.xml",
      testGroupName: "E2E-Tests",
      attachMeta: false,
      attachSteps: false,
      stepsInFailure: false,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
