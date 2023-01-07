/** Description of the subreddit to which a modmail conversation
 * belongs
 */
export interface ModmailConversationOwner {
  /** Name of the subreddit */
  displayName: string;

  /** Unknown */
  type: "subreddit";

  /** prefixed thing ID */
  id: string;
}
