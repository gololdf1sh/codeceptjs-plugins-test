Feature("analyze — many failures for clustering");

Scenario("element not found 1", ({ I }) => {
  I.amOnPage("/index.html");
  I.click('[data-test-id="missing-1"]');
});

Scenario("element not found 2", ({ I }) => {
  I.amOnPage("/index.html");
  I.click('[data-test-id="missing-2"]');
});

Scenario("element not found 3", ({ I }) => {
  I.amOnPage("/login.html");
  I.click('[data-test-id="missing-3"]');
});

Scenario("element not visible", ({ I }) => {
  I.amOnPage("/dynamic.html");
  I.seeElement('[data-test-id="submit-result"]');
});

Scenario("navigation error", ({ I }) => {
  I.amOnPage("/404-page.html");
  I.seeElement("body");
});
