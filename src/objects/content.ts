/** The base for all the reddit item data types. */
export interface ContentData {
  /** The unix timestamp when this item was created.  */
  createdUtc: number;

  /** The ID of this item. */
  id: string;
}

/** The base class that all other items inherit from. */
export abstract class Content implements ContentData {
  createdUtc: number;
  id: string;

  /** @internal */
  constructor(data: ContentData) {
    this.createdUtc = data.createdUtc;
    this.id = data.id;
  }
}
