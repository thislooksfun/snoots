import type { WikiPage } from "../object";

import { testClient } from "../../../helper/tests";

describe("Wiki", () => {
  let page1: WikiPage /* , page2: WikiPage */;

  beforeAll(async () => {
    page1 = await testClient.wiki.getPage(
      process.env.SNOOTS_TESTS_WIKI_SUBREDDIT1!,
      process.env.SNOOTS_TESTS_WIKI_PAGE1!
    );

    /* page2 = await testClient.wiki.getPage(
      process.env.SNOOTS_TESTS_WIKI_SUBREDDIT2!,
      process.env.SNOOTS_TESTS_WIKI_PAGE2!
    ) */
  });

  test("can get the content of a wiki page", async () => {
    expect(page1.contentMD).toBe(process.env.SNOOTS_TESTS_WIKI_PAGE1_CONTENT);
  });

  test("can add an editor to a wiki page", async () => {
    await page1.addEditor(process.env.SNOOTS_TESTS_WIKI_USER!);
    const results = await page1.getSettings();
    expect(results.editors).toContain(process.env.SNOOTS_TESTS_WIKI_USER!);
  });

  test("can remove an editor from a wiki page", async () => {
    await page1.removeEditor(process.env.SNOOTS_TESTS_WIKI_USER!);
    const results = await page1.getSettings();
    expect(results.editors).not.toContain(process.env.SNOOTS_TESTS_WIKI_USER!);
  });

  test("can edit the settings on a wiki page", async () => {
    const settings1 = await page1.changeSettings({
      listed: true,
      permlevel: 2,
    });
    expect(settings1.permlevel).toBe(2);
    const settings2 = await page1.changeSettings({
      listed: true,
      permlevel: 0,
    });
    expect(settings2.permlevel).toBe(0);
  });

  test.todo("can edit a wiki page");
  test.todo("can get the revision history for a wiki page");
  test.todo("can get the wiki revision history for a subreddit");
  test.todo("can revert to a given revision");
  test.todo("can get the discussions for a wiki page");
  test.todo("can get a list of wiki pages on a subreddit");
});
