import type { _Listing, Context, Fetcher } from "./listing";
import type Post from "../objects/post";
import { assertKind } from "../helper/util";
import Listing, { Pager } from "./listing";

class PostPager extends Pager<Post> {
  async fetch(ctx: Context): Promise<PostListing> {
    const pg = await this.nextPage(ctx);
    return new PostListing(pg, ctx);
  }
}

/** @internal */
export default class PostListing extends Listing<Post> {
  constructor(l: _Listing, ctx: Context) {
    let fetcher: Fetcher<Post> | undefined;

    if (l.after != null) {
      fetcher = new PostPager(l.after);
    }

    const arr: Post[] = [];
    for (const c of l.children) {
      assertKind("t3", c);
      arr.push(ctx.client.posts.fromRaw(c));
    }

    super(ctx, arr, fetcher);
  }
}
