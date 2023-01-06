import type {
  Fetcher,
  ListingContext,
  RedditObjectListing,
} from "../listing/listing";
import type { Subreddit } from "./object";

import { Listing, Pager } from "../listing/listing";

class SubredditPager extends Pager<Subreddit> {
  async fetch(context: ListingContext): Promise<SubredditListing> {
    const pg = await this.nextPage(context);
    return new SubredditListing(pg, context);
  }
}

/** @internal */
export class SubredditListing extends Listing<Subreddit> {
  constructor(l: RedditObjectListing, context: ListingContext) {
    let fetcher: Fetcher<Subreddit> | undefined;

    if (l.after != undefined) {
      fetcher = new SubredditPager(l.after);
    }

    const subreddits: Subreddit[] = [];
    for (const c of l.children) {
      subreddits.push(context.client.subreddits.fromRaw(c));
    }

    super(context, subreddits, fetcher);
  }
}
