Feature("PageInfo — passing test");

Scenario("passes — no page info should be collected", ({ I }) => {
  I.amOnPage("/errors.html");
  I.seeElement('[data-test-id="errors-title"]');
  I.seeElement('[data-test-id="error-block"]');
});
