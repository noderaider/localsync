import { Options } from "./Options";
import { Logger } from "./Logger";
import { Mechanism } from "./Mechanism";

/**
 * The context object used throughout localsync.
 *
 * @remarks
 * This object is used to allow passing of a single context around localsync with configured options and logger.
 */
export interface Context {
  options: Options;
  logger: Logger;
  mechanism: Mechanism;
  isFallback: boolean;
  isServer: boolean;
}
