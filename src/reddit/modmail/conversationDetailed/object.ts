import type { ModmailControls } from "../controls";
import type { ModmailConversationData } from "../conversation/object";
import type { ModmailConversationMessageData } from "../conversationMessage/types";
import type {
  ModmailConversationModeratorAction,
  ModmailConversationUserData,
} from "./types";

import { ModmailConversation } from "../conversation/object";

export interface ModmailConversationDetailedData
  extends ModmailConversationData {
  messages: Array<ModmailConversationMessageData>;
  user: ModmailConversationUserData;
  modActions: ModmailConversationModeratorAction;
}

export class ModmailConversationDetailed
  extends ModmailConversation
  implements ModmailConversationDetailedData
{
  messages: Array<ModmailConversationMessageData>;
  user: ModmailConversationUserData;
  modActions: ModmailConversationModeratorAction;

  /** @internal */
  constructor(
    controls: ModmailControls,
    data: ModmailConversationDetailedData
  ) {
    super(controls, data);

    (this.messages = data.messages),
      (this.user = data.user),
      (this.modActions = data.modActions);
  }
}
