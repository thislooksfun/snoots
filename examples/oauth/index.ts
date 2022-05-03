import { config } from "dotenv";
import express from "express";
import { Client, Credentials } from "snoots";

const port = 8080;
const redirectUri = `http://127.0.0.1:${port}/auth`;

// Set up variables from the .env file.
config();
const userAgent = process.env.USER_AGENT!;
const creds: Credentials = {
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
};

// Set up the web app.
const app = express();

// Add a simple message so you know it's working.
app.get("/", (_req, res) => res.send("Hello world!"));

// When the user navigates to /login redirect them to the Reddit OAuth url.
app.get("/login", (_req, res) => {
  const uri = Client.makeAuthUrl(
    creds.clientId,
    ["identity"],
    redirectUri,
    "some-state", // This should be RANDOM and validated in /auth.
    true
  );

  res.redirect(uri);
});

// When the Reddit OAuth succeeds it will redirect them here and give us a code.
// That code must be immediately passed to `authFromCode` (once the state has
// been verified) as it expires really quickly.
app.get("/auth", async (req, res) => {
  // Make sure we're getting the data we expect.
  const { code, state } = req.query;
  if (!code || typeof code !== "string" || !state) {
    res.status(400).send("Invalid request");
    return;
  }

  // Here you should check that the state is one generated in /login. If it's
  // different it's a likely CSRF attack and should be handled accordingly.
  if (state !== "some-state") {
    res.status(403).send("Unauthorized");
    return;
  }

  try {
    // Create a new Client from the given auth code. Note that the redirectUri
    // here MUST match the uri given to `getAuthUrl`, or else this will fail.
    const client = await Client.fromAuthCode(
      { userAgent, creds },
      code,
      redirectUri
    );

    // Get and display the user's information so we know it worked!
    const user = await client.me.fetch();
    res.send(`Hello ${user.name}!`);
  } catch (e) {
    // If something goes wrong, log it.
    console.error(e);
    res.status(500).send("Internal server error");
    return;
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
