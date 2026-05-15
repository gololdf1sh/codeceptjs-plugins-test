import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "junitreporter-default",
  tests: "../tests/smoke.test.ts",
  require: ["tsx/cjs"],
  output: "../output/junitreporter-default",

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
      outputName: "report.xml",
      attachMeta: true,
      attachSteps: true,
      stepsInFailure: true,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
