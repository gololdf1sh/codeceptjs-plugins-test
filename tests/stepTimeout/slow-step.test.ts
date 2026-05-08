Feature("StepTimeout — slow step tests");

Scenario("fast steps — all within timeout", ({ I }) => {
  I.amOnPage("/index.html");
  I.seeElement('[data-test-id="page-title"]');
  I.click('[data-test-id="action-button"]');
  I.seeElement('[data-test-id="action-result"]');
});

Scenario("slow step — waitForElement with long wait", ({ I }) => {
  I.amOnPage("/slow.html");
  I.seeElement('[data-test-id="slow-title"]');
  // delayed-content appears after 2s — if timeout < 2s, this should fail
  I.waitForElement('[data-test-id="delayed-content"]', 5);
});
