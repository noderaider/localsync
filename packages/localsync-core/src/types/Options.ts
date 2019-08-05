import { LogLevel } from "./LogLevel";
import { FallbackOptions } from "./FallbackOptions";

/**
 * Options used throughout localsync based on the `Config` object.
 *
 * @remarks
 * Differs from `Config` in that this ensures all options are set.
 * Used throughout localsync libs.
 */
export interface Options {
  channel: string;
  level: LogLevel;
  fallback: FallbackOptions;
}
