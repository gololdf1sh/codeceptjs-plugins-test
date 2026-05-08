import "dotenv/config";
import fs from "fs";
import path from "path";

const reportLines: string[] = [];

export const config: CodeceptJS.MainConfig = {
  name: "customreporter-default",
  tests: "../tests/customReporter/mixed.test.ts",
  require: ["tsx/cjs"],
  output: "../output/customreporter-default",

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
    customReporter: {
      enabled: true,
      onTestBefore: (test: any) => {
        reportLines.push(`[BEFORE] ${test.title}`);
      },
      onTestPassed: (test: any) => {
        reportLines.push(`[PASSED] ${test.title}`);
      },
      onTestFailed: (test: any, err: any) => {
        reportLines.push(`[FAILED] ${test.title} — ${err.message?.slice(0, 60)}`);
      },
      onTestFinished: (test: any) => {
        reportLines.push(`[FINISHED] ${test.title}`);
      },
      onResult: () => {
        const outputDir = path.resolve(__dirname, "../output/customreporter-default");
        fs.mkdirSync(outputDir, { recursive: true });
        fs.writeFileSync(
          path.join(outputDir, "custom-report.txt"),
          reportLines.join("\n") + "\n"
        );
      },
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
