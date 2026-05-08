import "dotenv/config";
import "../heal.mjs";
import { anthropic } from "@ai-sdk/anthropic";

export const config: CodeceptJS.MainConfig = {
  name: "heal-default",
  tests: "../tests/heal/broken-locator.test.ts",
  require: ["tsx/cjs", "./heal.js"],
  output: "../output/heal-default",

  helpers: {
    Playwright: {
      url: "http://localhost:8787",
      show: false,
      browser: "chromium",
      waitForNavigation: "load",
      windowSize: "1280x720",
    },
  },

  ai: {
    model: anthropic("claude-sonnet-4-20250514"),
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
