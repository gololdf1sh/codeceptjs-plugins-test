Feature("customLocator — shorthand locators");

Scenario("uses $ prefix to match data-test-id", ({ I }) => {
  I.amOnPage("/dynamic.html");
  I.seeElement("$dynamic-title");
  I.click("$card-alpha-btn");
  I.seeElement("$card-action-result");
  I.see("Alpha Action clicked!");
});

Scenario("uses $ prefix for form elements", ({ I }) => {
  I.amOnPage("/login.html");
  I.seeElement("$login-title");
  I.fillField("$username-input", "admin");
  I.fillField("$password-input", "admin");
  I.click("$login-button");
  I.seeElement("$login-success");
});
