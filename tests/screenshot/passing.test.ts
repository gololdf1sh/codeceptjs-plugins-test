Feature("Screenshot — passing test");

Scenario("passes — clicks button and sees result", ({ I }) => {
  I.amOnPage("/index.html");
  I.seeElement('[data-test-id="page-title"]');
  I.click('[data-test-id="action-button"]');
  I.seeElement('[data-test-id="action-result"]');
});
