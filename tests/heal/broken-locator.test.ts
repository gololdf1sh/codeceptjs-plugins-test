Feature("heal — broken locator");

Scenario("clicks button with wrong locator that AI should heal", ({ I }) => {
  I.amOnPage("/dynamic.html");
  I.seeElement('[data-test-id="dynamic-title"]');
  // This locator is wrong — actual is "submit-action"
  I.click('[data-test-id="submit-button"]');
  I.seeElement('[data-test-id="submit-result"]');
});
