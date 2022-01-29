import { Gateway } from "./gateway";
import { BasicAuth } from "./types";

/**
 * Reddit API application credentials
 *
 * To get these values:
 *
 * 1. Log into Reddit and go to https://www.reddit.com/prefs/apps/.
 * 1. Scroll to the bottom and click 'are you a developer? create an app...'.
 * 1. Select the type of application you wish to make. Most likely this will be
 *    'script'.
 * 1. Put in a name and redirect uri (it don't matter what you put, but you
 *    can't leave them blank).
 * 1. (optional) Add your main account as a developer.
 * 1. The ID is just below the name of the application, and the secret is where
 *    it says "secret"
 *
 * ![Where to find the client ID and secret](media://app_creds.png)
 */
export interface Credentials {
  /** The ID of your Reddit application. */
  clientId: string;
  /** The secret of your Reddit application. */
  clientSecret: string;
}

/** @internal */
export class CredsGateway extends Gateway {
  protected creds: Credentials;

  /** @internal */
  constructor(creds: Credentials, userAgent: string) {
    super("https://www.reddit.com", userAgent);
    this.creds = creds;
  }

  protected async auth(): Promise<BasicAuth> {
    return { user: this.creds.clientId, pass: this.creds.clientSecret };
  }

  protected mapPath(path: string): string {
    // api requests against www.reddit.com need to end in .json
    return `${path}.json`;
  }
}
