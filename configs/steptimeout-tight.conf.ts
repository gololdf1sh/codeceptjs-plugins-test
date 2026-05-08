import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "steptimeout-tight",
  tests: "../tests/stepTimeout/slow-step.test.ts",
  require: ["tsx/cjs"],
  output: "../output/steptimeout-tight",

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
    stepTimeout: {
      enabled: true,
      timeout: 1,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
