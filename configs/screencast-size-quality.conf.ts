import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "screencast-size-quality",
  tests: "../tests/screencast/passing.test.ts",
  require: ["tsx/cjs"],
  output: "../output/screencast-size-quality",

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
      size: { width: 640, height: 480 },
      quality: 50,
    },
    screenshot: { enabled: false },
    retryFailedStep: { enabled: false },
  },

  include: {},
};
