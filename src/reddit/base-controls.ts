import type { Client } from "../client";
import type { Gateway } from "../gateway/gateway";

/** The base class for all controls. */
export abstract class BaseControls {
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
   * Namespace an id with the proper prefix for its type.
   *
   * @param id The ID to namespace.
   *
   * @returns The namespaced version of the id.
   */
  public namespace(id: string): string {
    return id.startsWith(this.prefix) ? id : this.prefix + id;
  }
}
