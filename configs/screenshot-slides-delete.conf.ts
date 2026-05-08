import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "screenshot-slides-delete",
  tests: "../tests/screenshot/**/*.test.ts",
  require: ["tsx/cjs"],
  output: "../output/screenshot-slides-delete",

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
      on: "step",
      slides: true,
      deleteSuccessful: true,
    },
    retryFailedStep: { enabled: false },
  },

  include: {},
};
