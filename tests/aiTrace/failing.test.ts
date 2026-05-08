Feature("aiTrace — failing test");

Scenario("fails on non-existent element", ({ I }) => {
  I.amOnPage("/index.html");
  I.seeElement('[data-test-id="page-title"]');
  I.click('[data-test-id="does-not-exist"]');
});
