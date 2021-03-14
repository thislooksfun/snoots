import type { Data, RedditObject } from "../../helper/types";
import type { _Listing, Context, Fetcher, RedditMore } from "../listing";
import type Comment from "../../objects/comment";
import { emptyRedditListing, wrapChildren } from "./../util";
import { group } from "../../helper/util";
import Listing from "../listing";
import CommentListing from "./commentListing";

function fixCommentTree(objects: RedditObject[]) {
  // Map the items by their name.
  const map: Record<string, RedditObject> = {};
  for (const item of objects) {
    if (!item.data.name) throw "Hmm...";
    map[item.data.name] = item;

    // Ensure that all the comments have a replies listing.
    if (item.kind === "t1") {
      if (item.data.replies !== "") throw "?????";
      item.data.replies = { kind: "Listing", data: wrapChildren([]) };
    }
  }

  // Build up the tree.
  const tree: RedditObject[] = [];
  for (const item of objects) {
    const parent = map[item.data.parent_id];
    if (parent) {
      parent.data.replies.data.children.push(item);
    } else if (item.kind === "t1") {
      tree.push(item);
    }
  }

  return tree;
}

/** @internal */
export default class MoreComments implements Fetcher<Comment> {
  protected data: RedditMore;

  constructor(data: RedditMore) {
    this.data = data;
  }

  async fetch(ctx: Context): Promise<Listing<Comment>> {
    if (this.data.name === "t1__") {
      const id = this.data.parent_id.slice(3);
      const pth = `comments/${ctx.post}`;
      const res: Data = await ctx.client.get(pth, { comment: id });
      const obj: RedditObject = res[1].data.children[0];
      if (!obj) {
        return new CommentListing(emptyRedditListing, ctx);
      } else {
        const lst = obj.data.replies.data ?? emptyRedditListing;
        return new CommentListing(lst, ctx);
      }
    } else {
      const pages = await this.more(ctx);

      let things: RedditObject[] = [];
      for (const page of pages) {
        things = things.concat(page.things);
      }

      const children = fixCommentTree(things);
      return new CommentListing(wrapChildren(children), ctx);
    }
  }

  protected async more(ctx: Context): Promise<Data[]> {
    // TODO: Test the 100 limit!
    // api/morechildren has a max of 100 ids at a time, so we have to batch it.
    const children = this.data.children;
    const fetches = group(children, 100).map(c => {
      const query = { children: c.join(","), link_id: `t3_${ctx.post}` };
      return ctx.client.get<Data>("api/morechildren", query);
    });

    return Promise.all(fetches);
  }
}
