/** Detects whether we're currently running in a server environment. */
export const detectServer = () => typeof navigator === "undefined";
