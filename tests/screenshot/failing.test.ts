Feature("Screenshot — failing test");

Scenario("fails — looks for non-existent element", ({ I }) => {
  I.amOnPage("/index.html");
  I.seeElement('[data-test-id="page-title"]');
  I.seeElement('[data-test-id="does-not-exist"]');
});
