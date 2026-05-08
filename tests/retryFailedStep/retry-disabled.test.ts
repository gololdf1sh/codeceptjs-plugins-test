Feature("RetryFailedStep — disabled per scenario");

Scenario("no retry — fails immediately with disableRetryFailedStep", { disableRetryFailedStep: true }, ({ I }) => {
  I.amOnPage("/slow.html");
  I.seeElement('[data-test-id="slow-title"]');
  // delayed-content appears after 2s, without retry this should fail fast
  I.seeElement('[data-test-id="delayed-content"]');
});
