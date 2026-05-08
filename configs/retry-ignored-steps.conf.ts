import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "retry-ignored-steps",
  tests: "../tests/retryFailedStep/retry-passes.test.ts",
  require: ["tsx/cjs"],
  output: "../output/retry-ignored-steps",

  helpers: {
    Playwright: {
      url: `file://${path.resolve(__dirname, "..", "app")}`,
      show: false,
      browser: "chromium",
      waitForNavigation: "load",
      windowSize: "1280x720",
    },
  },

  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 5,
      ignoredSteps: ["seeElement"],
    },
    screenshot: { enabled: false },
  },

  include: {},
};
