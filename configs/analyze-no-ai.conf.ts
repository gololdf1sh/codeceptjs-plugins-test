import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "analyze-no-ai",
  tests: "../tests/analyze/few-failures.test.ts",
  require: ["tsx/cjs"],
  output: "../output/analyze-no-ai",

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
    analyze: {
      enabled: true,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
