import type {
  Fetcher,
  ListingContext,
  RedditListing,
} from "../../listing/listing";
import type { ModeratorActionedUserData } from "./base";

import { Listing, Pager } from "../../listing/listing";
import { fromRedditData } from "../../util";
import { ModeratorActionedUser } from "./base";

/** The data specific to a banned user. */
export interface BannedUserData extends ModeratorActionedUserData {
  /** The number of days left on the ban. If `null` the ban is permanent. */
  daysLeft: number | null;
  /** The mod note. */
  note: string;
}

/** A banned user. */
export class BannedUser
  extends ModeratorActionedUser
  implements BannedUserData
{
  daysLeft: number | null;
  note: string;

  /** @internal */
  constructor(data: BannedUserData) {
    super(data);

    this.daysLeft = data.daysLeft;
    this.note = data.note;
  }
}

// #region listing
class BannedUserPager extends Pager<BannedUser> {
  async fetch(context: ListingContext): Promise<BannedUserListing> {
    const pg = await this.nextPage(context);
    return new BannedUserListing(pg, context);
  }
}

/** @internal */
export class BannedUserListing extends Listing<BannedUser> {
  constructor(l: RedditListing, context: ListingContext) {
    let fetcher: Fetcher<BannedUser> | undefined;

    if (l.after != undefined) {
      fetcher = new BannedUserPager(l.after);
    }

    const users: BannedUser[] = [];
    for (const c of l.children) {
      users.push(new BannedUser(fromRedditData(c)));
    }

    super(context, users, fetcher);
  }
}
// #endregion listing
