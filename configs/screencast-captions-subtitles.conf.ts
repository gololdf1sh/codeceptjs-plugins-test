import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "screencast-captions-subtitles",
  tests: "../tests/screencast/passing.test.ts",
  require: ["tsx/cjs"],
  output: "../output/screencast-captions-subtitles",

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
      captions: true,
      subtitles: true,
    },
    screenshot: { enabled: false },
    retryFailedStep: { enabled: false },
  },

  include: {},
};
