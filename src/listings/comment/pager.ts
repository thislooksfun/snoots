import type { Comment } from "../../objects";
import { ListingContext, Pager } from "../listing";
import CommentListing from "./commentListing";

export default class CommentPager extends Pager<Comment> {
  async fetch(ctx: ListingContext): Promise<CommentListing> {
    const pg = await this.nextPage(ctx);
    return new CommentListing(pg, ctx);
  }
}
