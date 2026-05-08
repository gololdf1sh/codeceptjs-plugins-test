import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "steptimeout-normal",
  tests: "../tests/stepTimeout/slow-step.test.ts",
  require: ["tsx/cjs"],
  output: "../output/steptimeout-normal",

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
      timeout: 150,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
