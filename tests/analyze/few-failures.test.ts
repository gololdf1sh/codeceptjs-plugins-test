Feature("analyze — few failures");

Scenario("fails on missing element", ({ I }) => {
  I.amOnPage("/index.html");
  I.click('[data-test-id="nonexistent"]');
});

Scenario("fails on wrong page", ({ I }) => {
  I.amOnPage("/no-such-page.html");
  I.seeElement('[data-test-id="page-title"]');
});
