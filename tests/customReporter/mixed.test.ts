Feature("customReporter — mixed results");

Scenario("passes normally", ({ I }) => {
  I.amOnPage("/index.html");
  I.seeElement('[data-test-id="page-title"]');
});

Scenario("fails on purpose", ({ I }) => {
  I.amOnPage("/index.html");
  I.click('[data-test-id="nonexistent"]');
});

Scenario("also passes", ({ I }) => {
  I.amOnPage("/login.html");
  I.seeElement('[data-test-id="login-title"]');
});
