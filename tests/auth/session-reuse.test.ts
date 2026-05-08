Feature("auth — session reuse");

Before(({ login }) => {
  login("admin");
});

Scenario("first test sees dashboard after login", ({ I }) => {
  I.amOnPage("/dashboard.html");
  I.seeElement('[data-test-id="dashboard-title"]');
  I.see("Logged in as: admin");
});

Scenario("second test reuses session", ({ I }) => {
  I.amOnPage("/dashboard.html");
  I.seeElement('[data-test-id="dashboard-title"]');
  I.see("Logged in as: admin");
});

Scenario("third test also reuses session", ({ I }) => {
  I.amOnPage("/dashboard.html");
  I.seeElement('[data-test-id="dashboard-title"]');
});
