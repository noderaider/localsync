import { Config, Context } from "../types";
import { createOptions } from "./createOptions";
import { createLogger } from "./createLogger";
import { detectFallback } from "./detectFallback";
import { detectServer } from "./detectServer";

/**
 * The context object used internally throughout localsync.
 *
 * @param config The config passed to localsync.
 */
export const createContext = (config: Config): Context => {
  const options = createOptions(config);
  const logger = createLogger(options);
  const isServer = detectServer();
  const isFallback = detectFallback();
  const mechanism = isServer
    ? "serversync"
    : isFallback
    ? "cookiesync"
    : "storagesync";
  return { options, logger, mechanism, isServer, isFallback };
};
