import type { Data, RedditObject } from "../helper/types";
import type { _Listing, Context, RedditMore } from "./listing";
import type Comment from "../objects/comment";
import { emptyRedditListing, wrapChildren } from "./util";
import { More } from "./listing";
import Listing from "./listing";

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

class MoreComments extends More<Comment> {
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
}

/** @internal */
export default class CommentListing extends Listing<Comment> {
  constructor(l: _Listing, ctx: Context) {
    let more: MoreComments | undefined;
    const arr = [];
    for (const c of l.children) {
      switch (c.kind) {
        case "t1":
          arr.push(ctx.client.comments.fromRaw(c));
          break;
        case "more":
          more = new MoreComments(c.data as RedditMore);
          break;
        default:
          console.dir(c);
          throw "Invalid item!";
      }
    }

    super(ctx, arr, more);
  }
}
