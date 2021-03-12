/** The base for all the reddit object data types. */
export interface ContentData {
  /** The unix timestamp when this object was created.  */
  createdUtc: number;
  /** The ID of this object. */
  id: string;
}

/** The base class that all other objects inherit from. */
export default class Content implements ContentData {
  createdUtc: number;
  id: string;

  /** @internal */
  constructor(data: ContentData) {
    this.createdUtc = data.createdUtc;
    this.id = data.id;
  }
}
