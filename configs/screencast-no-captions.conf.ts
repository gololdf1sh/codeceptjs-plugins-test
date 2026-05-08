import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "screencast-no-captions",
  tests: "../tests/screencast/passing.test.ts",
  require: ["tsx/cjs"],
  output: "../output/screencast-no-captions",

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
      on: "test",
      captions: false,
      subtitles: false,
    },
    screenshot: { enabled: false },
    retryFailedStep: { enabled: false },
  },

  include: {},
};
