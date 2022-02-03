export type {
  OptionsOfTextResponseBody as GotOptions,
  Response as GotResponse,
} from "got";

/** The types of values that are allowed in a query. */
export type QueryValue = string | number | boolean | null | undefined;
/** A mapping of query parameters to add to a request. */
export type Query = Record<string, QueryValue>;

export interface BasicAuth {
  user: string;
  pass: string;
}
export interface BearerAuth {
  bearer: string;
}
export type Auth = BasicAuth | BearerAuth;

export interface RateLimit {
  /** How many requests are remaining. */
  remaining: number;
  /** When the window will reset. */
  reset: number;
}

interface RedditJsonResponse<T> {
  json: {
    errors: string[];
    data?: T;
  };
}

interface RedditError {
  error: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  error_description?: string;
}

export type SomeResponse<T> = T | RedditError | RedditJsonResponse<T>;
