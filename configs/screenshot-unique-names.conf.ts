import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "screenshot-unique-names",
  tests: "../tests/screenshot/failing.test.ts",
  require: ["tsx/cjs"],
  output: "../output/screenshot-unique-names",

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
      uniqueScreenshotNames: true,
    },
    retryFailedStep: { enabled: false },
  },

  include: {},
};
