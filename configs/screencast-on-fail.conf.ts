import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "screencast-on-fail",
  tests: "../tests/screencast/**/*.test.ts",
  require: ["tsx/cjs"],
  output: "../output/screencast-on-fail",

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
    screencast: {
      enabled: true,
      on: "fail",
    },
    screenshot: { enabled: false },
    retryFailedStep: { enabled: false },
  },

  include: {},
};
