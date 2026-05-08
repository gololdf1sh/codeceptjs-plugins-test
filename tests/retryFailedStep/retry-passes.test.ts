Feature("RetryFailedStep — retryable tests");

Scenario("retries and passes — delayed element appears after 2s", ({ I }) => {
  I.amOnPage("/slow.html");
  I.seeElement('[data-test-id="slow-title"]');
  // delayed-content appears after 2s, retry should catch it
  I.seeElement('[data-test-id="delayed-content"]');
});

Scenario("retries and passes — flaky element toggles visibility", ({ I }) => {
  I.amOnPage("/dynamic.html");
  I.seeElement('[data-test-id="dynamic-title"]');
  // flaky-element toggles every 800ms, retry should eventually find it visible
  I.seeElement('[data-test-id="flaky-element"]');
});
