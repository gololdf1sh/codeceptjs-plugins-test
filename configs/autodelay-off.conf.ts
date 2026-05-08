import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "autodelay-off",
  tests: "../tests/autoDelay/actions.test.ts",
  require: ["tsx/cjs"],
  output: "../output/autodelay-off",

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
    autoDelay: { enabled: false },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
