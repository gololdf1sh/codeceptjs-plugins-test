import "dotenv/config";
import path from "path";

export const config: CodeceptJS.MainConfig = {
  name: "retry-when",
  tests: "../tests/retryFailedStep/retry-passes.test.ts",
  require: ["tsx/cjs"],
  output: "../output/retry-when",

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
    retryFailedStep: {
      enabled: true,
      retries: 5,
      when: (err: Error) => err.message.includes("not visible"),
    },
    screenshot: { enabled: false },
  },

  include: {},
};
