Feature("heal — multiple broken locators");

Scenario("two broken locators within heal limit", ({ I }) => {
  I.amOnPage("/dynamic.html");
  // Wrong: actual is "card-alpha-btn"
  I.click('[data-test-id="alpha-button"]');
  I.seeElement('[data-test-id="card-action-result"]');
  // Wrong: actual is "card-beta-btn"
  I.click('[data-test-id="beta-button"]');
});
