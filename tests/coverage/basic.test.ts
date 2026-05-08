Feature("Coverage — basic navigation");

Scenario("visits multiple pages to generate coverage", ({ I }) => {
  I.amOnPage("/index.html");
  I.seeElement('[data-test-id="page-title"]');
  I.click('[data-test-id="action-button"]');
  I.amOnPage("/login.html");
  I.fillField('[data-test-id="username-input"]', "admin");
  I.fillField('[data-test-id="password-input"]', "admin");
  I.click('[data-test-id="login-button"]');
  I.amOnPage("/errors.html");
  I.seeElement('[data-test-id="error-block"]');
});
