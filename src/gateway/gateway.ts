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

import { makeDebug } from "../helper/debug";

// #region debug logging
const debug = {
  general: makeDebug("gateway"),
  request: makeDebug("gateway:request"),
  response: makeDebug("gateway:response"),
};

function debugRequest(method: string, path: string, options: GotOptions) {
  debug.request(
    "Making %s request to path '%s' with options %O",
    method,
    path,
    options
  );
}

function debugResponse(method: string, path: string, response: unknown) {
  debug.response(
    "Got response for %s request to '%s': %O",
    method,
    path,
    response
  );
}
// #endregion debug logging

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
    const options = await this.buildOptions(query);
    debugRequest("GET", path, options);
    const response: T = await got.get(this.mapPath(path), options).json();
    debugResponse("GET", path, response);
    return this.unwrap(response);
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const formOptions = { form: { api_type: "json", ...form } };
    return await this.doPost(path, formOptions, query);
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const jsonOptions = { json: { api_type: "json", ...json } };
    return await this.doPost(path, jsonOptions, query);
  }

  /** @internal */
  public getRateLimit(): Maybe<RateLimit> {
    return this.rateLimit ? { ...this.rateLimit } : undefined;
  }

  protected abstract auth(): Promise<Maybe<Auth>>;

  protected async doPost<T>(
    path: string,
    overrideOptions: GotOptions,
    query: Query
  ): Promise<T> {
    const baseOptions = await this.buildOptions(query);
    const options = { ...baseOptions, ...overrideOptions };
    debugRequest("POST", path, options);
    const response: T = await got.post(this.mapPath(path), options).json();
    debugResponse("POST", path, response);
    return this.unwrap(response);
  }

  protected abstract mapPath(path: string): string;

  protected handleError(message: string, description?: string): never {
    let errorMessage = `Reddit returned an error: ${message}`;
    if (description) errorMessage += `: ${description}`;
    throw new Error(errorMessage);
  }

  protected unwrap<T>(response: SomeResponse<T>): T {
    if (typeof response !== "object" || response == undefined) {
      return response;
    } else if ("json" in response) {
      const { errors, data } = response.json;
      if (errors.length > 0) {
        this.handleError(errors[0]);
      } else {
        return data!;
      }
    } else {
      if ("error" in response) {
        this.handleError(response.error, response.error_description);
      } else {
        return response;
      }
    }
  }

  protected async buildOptions(query: Query): Promise<GotOptions> {
    const options: GotOptions = {
      prefixUrl: this.endpoint,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { "user-agent": this.userAgent },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      searchParams: { ...query, raw_json: 1, api_type: "json" },
      hooks: {
        afterResponse: [
          r => this.transformRedirect(r),
          r => this.updateRatelimit(r),
        ],
      },
      followRedirect: false,
    };

    const auth = await this.auth();
    if (auth) {
      if ("bearer" in auth) {
        options.headers!["Authorization"] = `bearer ${auth.bearer}`;
      } else {
        options.username = auth.user;
        options.password = auth.pass;
      }
    }

    return options;
  }

  protected transformRedirect(response: GotResponse): GotResponse {
    const { statusCode, headers } = response;
    if (headers.location && statusCode >= 300 && statusCode < 400) {
      response.rawBody = Buffer.from(
        JSON.stringify({
          kind: "snoots_redirect",
          data: { location: headers.location },
        })
      );
    }
    return response;
  }

  protected updateRatelimit(response: GotResponse): GotResponse {
    const { headers } = response;
    const remain = Number.parseInt(headers["x-ratelimit-remaining"] as string);
    const reset = Number.parseInt(headers["x-ratelimit-reset"] as string);

    // To prevent race conditions, only update the rate limit if either...
    if (
      // ...we don't have one stored
      !this.rateLimit ||
      // ...the stored data is expired
      this.rateLimit.reset < Date.now() ||
      // ...the number of remaining requests has decreased
      this.rateLimit.remaining > remain
    ) {
      this.rateLimit = { remaining: remain, reset: Date.now() + reset * 1000 };
      debug.general(
        "Updated ratelimit: %d requests remaining, resets at %s",
        this.rateLimit.remaining,
        new Date(this.rateLimit.reset)
      );
    }

    return response;
  }
}
