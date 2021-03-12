export interface ContentData {
  createdUtc: number;
  id: string;
}

export default class Content implements ContentData {
  createdUtc: number;
  id: string;

  constructor(data: ContentData) {
    this.createdUtc = data.createdUtc;
    this.id = data.id;
  }
}
