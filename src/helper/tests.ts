import dotenv from "dotenv";
import { expand } from "dotenv-expand";

import { Client } from "../client";

const environmentVariables = dotenv.config();
expand(environmentVariables);

export const testClient = new Client({
  userAgent: process.env.SNOOTS_TESTS_CLIENT_USERAGENT!,
  creds: {
    clientId: process.env.SNOOTS_TESTS_CLIENT_CREDS_ID!,
    clientSecret: process.env.SNOOTS_TESTS_CLIENT_CREDS_SECRET!,
  },
  auth: {
    username: process.env.SNOOTS_TESTS_CLIENT_AUTH_USERNAME!,
    password: process.env.SNOOTS_TESTS_CLIENT_AUTH_PASSWORD!,
  },
});
