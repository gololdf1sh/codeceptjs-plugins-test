import "dotenv/config";

export const config: CodeceptJS.MainConfig = {
  name: "auth-save-file",
  tests: "../tests/auth/session-reuse.test.ts",
  require: ["tsx/cjs"],
  output: "../output/auth-save-file",

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
    auth: {
      enabled: true,
      saveToFile: true,
      inject: "login",
      users: {
        admin: {
          login: (I: CodeceptJS.I) => {
            I.amOnPage("/login.html");
            I.fillField('[data-test-id="username-input"]', "admin");
            I.fillField('[data-test-id="password-input"]', "admin");
            I.click('[data-test-id="login-button"]');
            I.waitForElement('[data-test-id="login-success"]', 3);
          },
          check: (I: CodeceptJS.I) => {
            I.amOnPage("/dashboard.html");
            I.seeElement('[data-test-id="dashboard-title"]');
          },
          fetch: (I: CodeceptJS.I) => {
            return I.executeScript(() => ({
              auth_token: localStorage.getItem("auth_token"),
              auth_user: localStorage.getItem("auth_user"),
            }));
          },
          restore: (I: CodeceptJS.I, session: any) => {
            I.amOnPage("/index.html");
            I.executeScript((s: any) => {
              localStorage.setItem("auth_token", s.auth_token);
              localStorage.setItem("auth_user", s.auth_user);
            }, session);
          },
        },
      },
    },
    retryFailedStep: { enabled: false },
    screenshot: { enabled: false },
  },

  include: {},
};
