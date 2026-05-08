import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "screenshot-on-test",
  tests: "../tests/screenshot/**/*.test.ts",
  require: ["tsx/cjs"],
  output: "../output/screenshot-on-test",

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
      on: "test",
    },
    retryFailedStep: { enabled: false },
  },

  include: {},
};
