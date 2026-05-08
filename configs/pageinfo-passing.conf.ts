import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "pageinfo-passing",
  tests: "../tests/pageInfo/passing.test.ts",
  require: ["tsx/cjs"],
  output: "../output/pageinfo-passing",

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
