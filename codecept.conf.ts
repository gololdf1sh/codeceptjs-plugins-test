import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "codeceptjs-plugins-test",
  tests: "./tests/**/*.test.ts",
  require: ["tsx/cjs"],
  output: "./output",

  helpers: {
    Playwright: {
      url: `file://${path.resolve(__dirname, "app")}`,
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
    },
    retryFailedStep: {
      enabled: true,
      retries: 3,
    },
  },

  include: {},
};
