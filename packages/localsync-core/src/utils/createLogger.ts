import { Options, LogLevel, Logger } from "../types";
import { supportsLevelFactory } from "./supportsLevelFactory";

/**
 * Creates a logger used in this instance of localsync.
 *
 * @param options The options object used to configure this instance of localsync.
 */
export const createLogger = (options: Options): Logger => {
  const supportsLevel = supportsLevelFactory(options);
  const supportsDebug = supportsLevel(LogLevel.DEBUG);
  const supportsInfo = supportsLevel(LogLevel.INFO);
  const supportsWarn = supportsLevel(LogLevel.WARN);
  const supportsError = supportsLevel(LogLevel.ERROR);
  return {
    debug(message: string) {
      if (supportsDebug) {
        console.debug(message);
      }
    },
    info(message: string) {
      if (supportsInfo) {
        console.info(message);
      }
    },
    warn(message: string) {
      if (supportsWarn) {
        console.warn(message);
      }
    },
    error(message: string) {
      if (supportsError) {
        console.error(message);
      }
    }
  };
};
