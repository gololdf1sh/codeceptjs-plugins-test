Feature("RetryFailedStep — deferToScenarioRetries");

Scenario("scenario retry takes over — step retry disabled", ({ I }) => {
  I.amOnPage("/slow.html");
  I.seeElement('[data-test-id="slow-title"]');
  I.seeElement('[data-test-id="delayed-content"]');
}).retry(2);
