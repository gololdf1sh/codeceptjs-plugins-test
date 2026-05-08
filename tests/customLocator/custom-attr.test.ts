Feature("customLocator — custom attribute and prefix");

Scenario("uses = prefix with data-qa attribute", ({ I }) => {
  I.amOnPage("/dynamic.html");
  I.seeElement("=card-alpha");
  I.click("=alpha-action");
  I.seeElement("=card-beta");
  I.click("=beta-action");
});
