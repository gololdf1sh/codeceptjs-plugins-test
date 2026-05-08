import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "pageinfo-custom-classes",
  tests: "../tests/pageInfo/failing-on-errors-page.test.ts",
  require: ["tsx/cjs"],
  output: "../output/pageinfo-custom-classes",

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
      errorClasses: ["danger"],
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
