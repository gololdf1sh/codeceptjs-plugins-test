import "dotenv/config";
import "../heal.mjs";
import { anthropic } from "@ai-sdk/anthropic";

export const config: CodeceptJS.MainConfig = {
  name: "heal-exceed",
  tests: "../tests/heal/exceed-limit.test.ts",
  require: ["tsx/cjs"],
  output: "../output/heal-exceed",

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
      healLimit: 2,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
