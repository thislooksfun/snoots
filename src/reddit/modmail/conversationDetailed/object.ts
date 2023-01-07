import type { ModmailControls } from "../controls";
import type { ModmailConversationData } from "../conversation/object";
import type { ModmailConversationMessageData } from "../conversationMessage/types";
import type {
  ModmailConversationModeratorAction,
  ModmailConversationUserData,
} from "./types";

import { ModmailConversation } from "../conversation/object";

/** The attributes specific to ModmailConversationDetailed objects */
export interface ModmailConversationDetailedData
  extends ModmailConversationData {
  /** Array of messages belonging to the conversation */
  messages: Array<ModmailConversationMessageData>;

  /** Details regarding the original sender of the modmail conversation */
  user: ModmailConversationUserData;

  /** Details regarding moderator actions performed in the conversation */
  modActions: Array<ModmailConversationModeratorAction>;
}

/** a single detailed modmail conversation */
export class ModmailConversationDetailed
  extends ModmailConversation
  implements ModmailConversationDetailedData
{
  /** @inheritDoc */
  messages: Array<ModmailConversationMessageData>;

  /** @inheritDoc */
  user: ModmailConversationUserData;

  /** @inheritDoc */
  modActions: Array<ModmailConversationModeratorAction>;

  /** @internal */
  constructor(
    controls: ModmailControls,
    data: ModmailConversationDetailedData
  ) {
    super(controls, data);

    this.messages = data.messages;
    this.user = data.user;
    this.modActions = data.modActions;
  }
}
