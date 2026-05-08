import "dotenv/config";
import { anthropic } from "@ai-sdk/anthropic";

export const config: CodeceptJS.MainConfig = {
  name: "analyze-cluster",
  tests: "../tests/analyze/many-failures.test.ts",
  require: ["tsx/cjs"],
  output: "../output/analyze-cluster",

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
    analyze: {
      enabled: true,
      clusterize: 5,
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: true, on: "fail" },
  },

  include: {},
};
