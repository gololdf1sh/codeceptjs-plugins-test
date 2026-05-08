Feature("AutoDelay — multiple actions");

Scenario("performs several actions to measure delay impact", ({ I }) => {
  I.amOnPage("/login.html");
  I.fillField('[data-test-id="username-input"]', "admin");
  I.fillField('[data-test-id="password-input"]', "admin");
  I.click('[data-test-id="login-button"]');
  I.amOnPage("/index.html");
  I.click('[data-test-id="action-button"]');
  I.amOnPage("/dynamic.html");
  I.click('[data-test-id="submit-action"]');
});
