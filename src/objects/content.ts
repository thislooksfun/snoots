export interface ContentData {
  created: number;
  createdUtc: number;
  id: string;
  name: string;
}

export default class Content implements ContentData {
  created: number;
  createdUtc: number;
  id: string;
  name: string;

  constructor(data: ContentData) {
    this.created = data.created;
    this.createdUtc = data.createdUtc;
    this.id = data.id;
    this.name = data.name;
  }
}
