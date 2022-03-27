import type {
  Fetcher,
  ListingContext,
  RedditListing,
} from "../listing/listing";
import type { User } from "./object/base-object";

import { Listing, Pager } from "../listing/listing";

class UserPager extends Pager<User> {
  async fetch(context: ListingContext): Promise<UserListing> {
    const pg = await this.nextPage(context);
    return new UserListing(pg, context);
  }
}

/** @internal */
export class UserListing extends Listing<User> {
  constructor(l: RedditListing, context: ListingContext) {
    let fetcher: Fetcher<User> | undefined;

    if (l.after) {
      fetcher = new UserPager(l.after);
    }

    const users: User[] = [];
    for (const c of l.children) {
      users.push(context.client.users.fromRaw(c));
    }

    super(context, users, fetcher);
  }
}
