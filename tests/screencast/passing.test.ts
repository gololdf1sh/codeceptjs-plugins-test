Feature("Screencast — passing test");

Scenario("passes — navigates and clicks", ({ I }) => {
  I.amOnPage("/index.html");
  I.seeElement('[data-test-id="page-title"]');
  I.click('[data-test-id="action-button"]');
  I.seeElement('[data-test-id="action-result"]');
  I.amOnPage("/errors.html");
  I.seeElement('[data-test-id="errors-title"]');
});
