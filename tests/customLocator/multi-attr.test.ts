Feature("customLocator — multiple attributes");

Scenario("matches either data-test-id or data-qa", ({ I }) => {
  I.amOnPage("/dynamic.html");
  // data-test-id="dynamic-title" (no data-qa)
  I.seeElement("=dynamic-title");
  // data-qa="alpha-action" (has data-test-id="card-alpha-btn" too)
  I.click("=alpha-action");
  I.seeElement("=card-action-result");
});
