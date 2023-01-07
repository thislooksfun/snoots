import type {
  Fetcher,
  ListingContext,
  RedditListing,
} from "../listing/listing";
import type { RedditObject } from "../types";
import type { WikiPageRevisionData } from "./types";

import { Listing, Pager } from "../listing/listing";

/** @internal */
type WikiRevisionsRedditResponse = {
  author: RedditObject<{ name: string }>;
  timestamp: number;
  page: string;
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  revision_hidden: boolean;
  reason: string;
  id: string;
};

/** @internal */
class WikiRevisionsPager extends Pager<WikiPageRevisionData> {
  async fetch(context: ListingContext): Promise<WikiRevisionsListing> {
    const pg = await this.nextPage<WikiRevisionsRedditResponse>(context);
    return new WikiRevisionsListing(pg, context);
  }
}

/** Listing class for wiki page revisions */
export class WikiRevisionsListing extends Listing<WikiPageRevisionData> {
  /** @internal */
  constructor(
    l: RedditListing<WikiRevisionsRedditResponse>,
    context: ListingContext
  ) {
    let fetcher: Fetcher<WikiPageRevisionData> | undefined;
    if (l.after != undefined) fetcher = new WikiRevisionsPager(l.after);

    const items: WikiPageRevisionData[] = [];
    for (const c of l.children) {
      items.push({
        author: c.author.data.name,
        timestamp: c.timestamp,
        page: c.page,
        hidden: c.revision_hidden,
        reason: c.reason,
        revisionID: c.id,
      });
    }
    super(context, items, fetcher);
  }
}
