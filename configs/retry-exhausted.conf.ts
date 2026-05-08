import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "retry-exhausted",
  tests: "../tests/retryFailedStep/retry-exhausted.test.ts",
  require: ["tsx/cjs"],
  output: "../output/retry-exhausted",

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
      retries: 2,
      minTimeout: 500,
      factor: 2,
    },
    screenshot: { enabled: false },
  },

  include: {},
};
