import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "retry-default",
  tests: "../tests/retryFailedStep/retry-passes.test.ts",
  require: ["tsx/cjs"],
  output: "../output/retry-default",

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
    },
    screenshot: { enabled: false },
  },

  include: {},
};
