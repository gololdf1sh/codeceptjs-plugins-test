Feature("RetryFailedStep — always fails (exhausts retries)");

Scenario("exhausts retries — element never exists", ({ I }) => {
  I.amOnPage("/index.html");
  I.seeElement('[data-test-id="page-title"]');
  I.seeElement('[data-test-id="never-exists"]');
});
