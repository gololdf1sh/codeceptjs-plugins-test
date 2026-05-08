import "dotenv/config";
import "../heal.mjs";

export const config: CodeceptJS.MainConfig = {
  name: "heal-no-ai",
  tests: "../tests/heal/broken-locator.test.ts",
  require: ["tsx/cjs"],
  output: "../output/heal-no-ai",

  helpers: {
    Playwright: {
      url: "http://localhost:8787",
      show: false,
      browser: "chromium",
      waitForNavigation: "load",
      windowSize: "1280x720",
    },
  },

  plugins: {
    heal: {
      enabled: true,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
