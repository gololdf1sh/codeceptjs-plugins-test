import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "screenshot-on-file",
  tests: "../tests/screenshot/passing.test.ts",
  require: ["tsx/cjs"],
  output: "../output/screenshot-on-file",

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
      on: "file",
      path: "../tests/screenshot/passing.test.ts",
    },
    retryFailedStep: { enabled: false },
  },

  include: {},
};
