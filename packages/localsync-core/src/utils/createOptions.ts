import { Config, Options, LogLevel } from "../types";
import { createFallbackOptions } from "./createFallbackOptions";

/**
 * Transforms a config into an options object with all fields defaulted.
 *
 * @param config The config passed to localsync.
 */
export const createOptions = (config: Config): Options => {
  const isChannelOk =
    typeof config.channel === "string" && config.channel.length > 0;
  if (!isChannelOk) {
    throw new Error(
      "localsync requires a channel config (string).\n\tThe channel is used to identity unique channels for pub / sub messages."
    );
  }

  // Default log level is INFO in dev or ERROR in prod.
  const level = config.level
    ? config.level
    : process.env.NODE_ENV === "development"
    ? LogLevel.INFO
    : LogLevel.ERROR;

  return {
    ...config,
    level,
    fallback: createFallbackOptions(config.fallback)
  };
};
