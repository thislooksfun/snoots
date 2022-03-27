import type {
  Fetcher,
  ListingContext,
  RedditListing,
} from "../../listing/listing";

import { Listing, Pager } from "../../listing/listing";
import { fromRedditData } from "../../util";

/** The data specific to a ModeratorActionedUser. */
export interface ModeratorActionedUserData {
  /** The unix timestamp when the action occurred. */
  date: number;

  /** The ID of this user. */
  id: string;

  /** The username of this user. */
  name: string;

  // TODO: document or remove.
  // relId: string;
}

/** A user that a moderator has taken some action on (like banning). */
export class ModeratorActionedUser implements ModeratorActionedUserData {
  date: number;
  id: string;
  name: string;

  /** @internal */
  constructor(data: ModeratorActionedUserData) {
    this.date = data.date;
    this.id = data.id;
    this.name = data.name;
  }
}

// #region listing
class ModeratorActionedUserPager extends Pager<ModeratorActionedUser> {
  async fetch(context: ListingContext): Promise<ModeratorActionedUserListing> {
    const pg = await this.nextPage(context);
    return new ModeratorActionedUserListing(pg, context);
  }
}

/** @internal */
export class ModeratorActionedUserListing extends Listing<ModeratorActionedUser> {
  constructor(l: RedditListing, context: ListingContext) {
    let fetcher: Fetcher<ModeratorActionedUser> | undefined;

    if (l.after != undefined) {
      fetcher = new ModeratorActionedUserPager(l.after);
    }

    const users: ModeratorActionedUser[] = [];
    for (const c of l.children) {
      users.push(new ModeratorActionedUser(fromRedditData(c)));
    }

    super(context, users, fetcher);
  }
}
// #endregion listing
