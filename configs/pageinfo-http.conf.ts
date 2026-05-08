import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "pageinfo-http",
  tests: "../tests/pageInfo/failing-on-errors-page.test.ts",
  require: ["tsx/cjs"],
  output: "../output/pageinfo-http",

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
    pageInfo: {
      enabled: true,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
