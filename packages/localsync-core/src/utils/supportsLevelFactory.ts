import { LogLevel, Options } from "../types";

/**
 * Creates a function that determines whether the log should occur dependent on configured level.
 *
 * @param options The options used in the current localsync instance.
 */
export const supportsLevelFactory = (options: Options) => {
  switch (options.level) {
    case LogLevel.DEBUG:
      return (level: LogLevel) =>
        level === LogLevel.DEBUG ||
        level === LogLevel.INFO ||
        level === LogLevel.WARN ||
        level === LogLevel.ERROR;
    case LogLevel.INFO:
      return (level: LogLevel) =>
        level === LogLevel.INFO ||
        level === LogLevel.WARN ||
        level === LogLevel.ERROR;
    case LogLevel.WARN:
      return (level: LogLevel) =>
        level === LogLevel.WARN || level === LogLevel.ERROR;
    case LogLevel.ERROR:
      return (level: LogLevel) => level === LogLevel.ERROR;
  }
};
