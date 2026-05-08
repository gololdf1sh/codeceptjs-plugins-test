import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "pageinfo-default",
  tests: "../tests/pageInfo/failing-on-errors-page.test.ts",
  require: ["tsx/cjs"],
  output: "../output/pageinfo-default",

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
    pageInfo: {
      enabled: true,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
