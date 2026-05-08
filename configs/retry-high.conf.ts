import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "retry-high",
  tests: "../tests/retryFailedStep/retry-passes.test.ts",
  require: ["tsx/cjs"],
  output: "../output/retry-high",

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
      factor: 1.5,
    },
    screenshot: { enabled: false },
  },

  include: {},
};
