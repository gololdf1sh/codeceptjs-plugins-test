import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "pageinfo-clean-page",
  tests: "../tests/pageInfo/failing-on-index.test.ts",
  require: ["tsx/cjs"],
  output: "../output/pageinfo-clean-page",

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
      browserLogs: ["error", "warning"],
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
