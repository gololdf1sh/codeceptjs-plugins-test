Feature("PageInfo — failing on errors page");

Scenario("fails on errors page — should capture error elements + console logs", ({ I }) => {
  I.amOnPage("/errors.html");
  I.seeElement('[data-test-id="errors-title"]');
  I.click('[data-test-id="trigger-console-error"]');
  I.seeElement('[data-test-id="does-not-exist"]');
});
