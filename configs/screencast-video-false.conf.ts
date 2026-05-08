import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "screencast-video-false",
  tests: "../tests/screencast/passing.test.ts",
  require: ["tsx/cjs"],
  output: "../output/screencast-video-false",

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
      video: false,
      subtitles: true,
    },
    screenshot: { enabled: false },
    retryFailedStep: { enabled: false },
  },

  include: {},
};
