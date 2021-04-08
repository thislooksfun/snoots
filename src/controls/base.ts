import type Client from "../client";

/** The base class for all controls. */
export default abstract class BaseControls {
  protected client: Client;
  protected prefix: string;

  /** @internal */
  constructor(client: Client, prefix: string) {
    this.client = client;
    this.prefix = prefix;
  }

  /** @internal */
  getClient(): Client {
    return this.client;
  }

  /**
   * Namespace an id with the prefix.
   *
   * @param id The ID of the item.
   *
   * @returns The namespaced version of the id.
   */
  protected namespace(id: string): string {
    return this.prefix + id;
  }
}
