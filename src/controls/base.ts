import type Client from "../client";
import type { Gateway } from "../gateway/gateway";

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
  public get gateway(): Gateway {
    return this.client.gateway;
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
