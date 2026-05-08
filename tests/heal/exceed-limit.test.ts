Feature("heal — exceed heal limit");

Scenario("three broken locators but limit is 2", ({ I }) => {
  I.amOnPage("/dynamic.html");
  // Wrong locator #1
  I.click('[data-test-id="alpha-button"]');
  I.seeElement('[data-test-id="card-action-result"]');
  // Wrong locator #2
  I.click('[data-test-id="beta-button"]');
  I.seeElement('[data-test-id="card-action-result"]');
  // Wrong locator #3 — should fail (limit=2 exhausted)
  I.click('[data-test-id="submit-button"]');
});
