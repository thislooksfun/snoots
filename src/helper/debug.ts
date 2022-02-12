import type { Debugger } from "debug";

import Debug from "debug";

// Boolean formatter
Debug.formatters.b = v => (v ? "true" : "false");

{
  // Log some basic info on using DEBUG to help people if they get stuck. :)
  // This is the only use of the top-level 'snoots' debug namespace. Every
  // meaningful debug log will be scoped, and thus included under `snoots:*`.
  Debug("snoots")(
    [
      "Hello there!",
      "It seems you are trying to debug snoots.",
      "To view all debug logs use `DEBUG='snoots:*'`",
      "To list all the debug namespaces used set `DEBUG='snoots:debug-namespaces'`",
      "For more information on the debug module see https://npmjs.com/package/debug",
      "Nothing else will be printed to the top-level 'snoots' namespace.",
    ].join("\n")
  );
}

// This will log every created debug namespace, so no need to go digging around
// the codebase to find them all.
const debugNamespace = Debug("snoots:debug-namespaces");
export function makeDebug(scope: string): Debugger {
  const namespace = `snoots:${scope}`;
  debugNamespace("Making debug logger with namespace '%s'", namespace);
  return Debug(namespace);
}
