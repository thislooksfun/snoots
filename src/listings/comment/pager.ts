import type { Comment } from "../../objects";
import type { ListingContext } from "../listing";

import { Pager } from "../listing";
import { CommentListing } from "./commentListing";

export class CommentPager extends Pager<Comment> {
  async fetch(context: ListingContext): Promise<CommentListing> {
    const pg = await this.nextPage(context);
    return new CommentListing(pg, context);
  }
}
