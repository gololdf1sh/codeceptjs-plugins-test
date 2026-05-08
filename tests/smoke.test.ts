Feature("Smoke — verify test app works");

Scenario("Home page loads with all elements", ({ I }) => {
  I.amOnPage("/index.html");
  I.seeElement('[data-test-id="page-title"]');
  I.seeElement('[data-test-id="item-1"]');
  I.seeElement('[data-test-id="action-button"]');
  I.click('[data-test-id="action-button"]');
  I.seeElement('[data-test-id="action-result"]');
});

Scenario("Login flow works", ({ I }) => {
  I.amOnPage("/login.html");
  I.seeElement('[data-test-id="login-title"]');
  I.fillField('[data-test-id="username-input"]', "admin");
  I.fillField('[data-test-id="password-input"]', "admin");
  I.click('[data-test-id="login-button"]');
  I.seeElement('[data-test-id="login-success"]');
});

Scenario("Errors page has all error elements", ({ I }) => {
  I.amOnPage("/errors.html");
  I.seeElement('[data-test-id="error-block"]');
  I.seeElement('[data-test-id="warning-block"]');
  I.seeElement('[data-test-id="alert-block"]');
  I.seeElement('[data-test-id="danger-block"]');
});

Scenario("Dynamic page — submit button works", ({ I }) => {
  I.amOnPage("/dynamic.html");
  I.seeElement('[data-test-id="submit-action"]');
  I.click('[data-test-id="submit-action"]');
  I.seeElement('[data-test-id="submit-result"]');
});
