import { LogLevel } from "./LogLevel";
import { FallbackOptions } from "./FallbackOptions";

/**
 * The required `config` parameter to `localsync`.
 *
 * @remarks
 * Differs from Options in that this leaves some arguments optional.
 */
export interface Config {
  channel: string;
  level?: LogLevel;
  fallback?: Partial<FallbackOptions>;
}
