import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "screenshot-ignore-steps",
  tests: "../tests/screenshot/passing.test.ts",
  require: ["tsx/cjs"],
  output: "../output/screenshot-ignore-steps",

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
      deleteSuccessful: false,
      ignoreSteps: [/seeElement/],
    },
    retryFailedStep: { enabled: false },
  },

  include: {},
};
