Feature("StepTimeout — limitTime interaction");

Scenario("limitTime sets per-step timeout", ({ I }) => {
  I.amOnPage("/slow.html");
  I.seeElement('[data-test-id="slow-title"]');
  I.limitTime(10).waitForElement('[data-test-id="delayed-content"]', 5);
  I.seeElement('[data-test-id="delayed-content"]');
});
