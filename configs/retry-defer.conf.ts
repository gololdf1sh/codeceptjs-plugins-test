import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "retry-defer",
  tests: "../tests/retryFailedStep/retry-defer.test.ts",
  require: ["tsx/cjs"],
  output: "../output/retry-defer",

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
      minTimeout: 500,
      deferToScenarioRetries: true,
    },
    screenshot: { enabled: false },
  },

  include: {},
};
