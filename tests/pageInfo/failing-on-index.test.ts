Feature("PageInfo — failing on clean page");

Scenario("fails on index page — no error elements to capture", ({ I }) => {
  I.amOnPage("/index.html");
  I.seeElement('[data-test-id="page-title"]');
  I.seeElement('[data-test-id="does-not-exist"]');
});
