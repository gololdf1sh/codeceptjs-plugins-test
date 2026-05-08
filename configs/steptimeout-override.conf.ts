import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "steptimeout-override",
  tests: "../tests/stepTimeout/limit-time.test.ts",
  require: ["tsx/cjs"],
  output: "../output/steptimeout-override",

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
      overrideStepLimits: true,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
