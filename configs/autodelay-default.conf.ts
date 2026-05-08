import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "autodelay-default",
  tests: "../tests/autoDelay/actions.test.ts",
  require: ["tsx/cjs"],
  output: "../output/autodelay-default",

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
    autoDelay: {
      enabled: true,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
