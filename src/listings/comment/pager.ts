import type { Comment } from "../../objects";
import type { Context } from "../listing";
import { Pager } from "../listing";
import { CommentListing } from "./commentListing";

export class CommentPager extends Pager<Comment> {
  async fetch(ctx: Context): Promise<CommentListing> {
    const pg = await this.nextPage(ctx);
    return new CommentListing(pg, ctx);
  }
}
