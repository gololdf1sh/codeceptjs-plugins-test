import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "screenshot-fullpage",
  tests: "../tests/screenshot/failing.test.ts",
  require: ["tsx/cjs"],
  output: "../output/screenshot-fullpage",

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
    screenshot: {
      enabled: true,
      on: "fail",
      fullPageScreenshots: true,
    },
    retryFailedStep: { enabled: false },
  },

  include: {},
};
