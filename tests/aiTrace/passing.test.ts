Feature("aiTrace — passing test");

Scenario("visits pages and interacts with elements", ({ I }) => {
  I.amOnPage("/index.html");
  I.seeElement('[data-test-id="page-title"]');
  I.click('[data-test-id="action-button"]');
  I.amOnPage("/login.html");
  I.seeElement('[data-test-id="username-input"]');
});
