import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "retry-randomize",
  tests: "../tests/retryFailedStep/retry-exhausted.test.ts",
  require: ["tsx/cjs"],
  output: "../output/retry-randomize",

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
      retries: 3,
      minTimeout: 300,
      factor: 1,
      randomize: true,
    },
    screenshot: { enabled: false },
  },

  include: {},
};
