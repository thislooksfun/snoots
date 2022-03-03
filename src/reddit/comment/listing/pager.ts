import type { ListingContext } from "../../listing/listing";
import type { Comment } from "../object";

import { Pager } from "../../listing/listing";
import { CommentListing } from "./listing";

export class CommentPager extends Pager<Comment> {
  async fetch(context: ListingContext): Promise<CommentListing> {
    const pg = await this.nextPage(context);
    return new CommentListing(pg, context);
  }
}
