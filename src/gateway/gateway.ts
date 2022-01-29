import type { Data, Maybe } from "../helper/types";
import type {
  Auth,
  GotOptions,
  GotResponse,
  Query,
  RateLimit,
  SomeResponse,
} from "./types";

import got from "got";

/**
 * The gateway to the Reddit api.
 *
 * You shouldn't have to use this directly. If you end up needing this class in
 * order to interact with the Reddit API please open an issue or submit a pull
 * request so we can add official support for your use case.
 */
export abstract class Gateway {
  protected rateLimit: Maybe<RateLimit>;
  protected userAgent: string;
  protected endpoint: string;

  /** @internal */
  constructor(endpoint: string, userAgent: string) {
    this.endpoint = endpoint;
    this.userAgent = userAgent;
  }

  /**
   * Issue a GET request to the Reddit API.
   *
   * You can use this method, but you most likely don't want to. If you end up
   * needing this method in order to interact with the Reddit API please open an
   * issue or submit a pull request so we can add official support for your use
   * case.
   *
   * @internal
   *
   * @param path The path to GET.
   * @param query The query params.
   * @returns The result.
   */
  public async get<T>(path: string, query: Query = {}): Promise<T> {
    const opts = await this.buildOpts(query);
    const res: T = await got.get(this.mapPath(path), opts).json();
    return this.unwrap(res);
  }

  /**
   * Issue a POST request to the Reddit API with x-www-form-urlencoded data.
   *
   * You can use this method, but you most likely don't want to. If you end up
   * needing this method in order to interact with the Reddit API please open an
   * issue or submit a pull request so we can add official support for your use
   * case.
   *
   * @internal
   *
   * @param path The path to POST.
   * @param form The data to POST.
   * @param query The query params.
   * @returns The result.
   */
  public async post<T>(
    path: string,
    form: Data,
    query: Query = {}
  ): Promise<T> {
    const formOpts = { form: { api_type: "json", ...form } };
    return await this.doPost(path, formOpts, query);
  }

  /**
   * Issue a POST request to the Reddit API with json data.
   *
   * You can use this method, but you most likely don't want to. If you end up
   * needing this method in order to interact with the Reddit API please open an
   * issue or submit a pull request so we can add official support for your use
   * case.
   *
   * @internal
   *
   * @param path The path to POST.
   * @param json The data to POST.
   * @param query The query params.
   * @returns The result.
   */
  public async postJson<T>(
    path: string,
    json: Data,
    query: Query = {}
  ): Promise<T> {
    const jsonOpts = { json: { api_type: "json", ...json } };
    return await this.doPost(path, jsonOpts, query);
  }

  protected abstract auth(): Promise<Maybe<Auth>>;

  protected async doPost<T>(
    path: string,
    opts: GotOptions,
    query: Query
  ): Promise<T> {
    const baseOpts = await this.buildOpts(query);
    const res: T = await got
      .post(this.mapPath(path), { ...baseOpts, ...opts })
      .json();
    return this.unwrap(res);
  }

  protected abstract mapPath(path: string): string;

  protected handleError(msg: string, desc?: string): never {
    let errMsg = `Reddit returned an error: ${msg}`;
    if (desc != null) errMsg += `: ${desc}`;
    throw new Error(errMsg);
  }

  protected unwrap<T>(res: SomeResponse<T>): T {
    if (typeof res !== "object") {
      return res;
    } else if ("json" in res) {
      const { errors, data } = res.json;
      if (errors.length > 0) {
        this.handleError(errors[0]);
      } else {
        return data!;
      }
    } else {
      if ("error" in res) {
        this.handleError(res.error, res.error_description);
      } else {
        return res;
      }
    }
  }

  protected async buildOpts(query: Query): Promise<GotOptions> {
    const opts: GotOptions = {
      prefixUrl: this.endpoint,
      headers: { "user-agent": this.userAgent },
      searchParams: { ...query, raw_json: 1, api_type: "json" },
      hooks: { afterResponse: [r => this.updateRatelimit(r)] },
    };

    const auth = await this.auth();
    if (auth) {
      if ("bearer" in auth) {
        opts.headers!["Authorization"] = `bearer ${auth.bearer}`;
      } else {
        opts.username = auth.user;
        opts.password = auth.pass;
      }
    }

    return opts;
  }

  protected updateRatelimit(res: GotResponse): GotResponse {
    const remain = parseInt(res.headers["x-ratelimit-remaining"] as string);
    const reset = parseInt(res.headers["x-ratelimit-reset"] as string) * 1000;
    this.rateLimit = { remaining: remain, reset: Date.now() + reset };
    return res;
  }
}
