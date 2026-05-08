Feature("aiTrace — no navigation between steps");

Scenario("interacts on single page only", ({ I }) => {
  I.amOnPage("/login.html");
  I.seeElement('[data-test-id="username-input"]');
  I.fillField('[data-test-id="username-input"]', "admin");
  I.fillField('[data-test-id="password-input"]', "secret");
  I.seeElement('[data-test-id="login-button"]');
});
