import { Config } from "./Config";
import { CreateController } from "./CreateController";

/**
 * This is the current localsync interface.
 */
export interface Localsync<TArgs extends any[], TMessage> {
  (config: Config): CreateController<TArgs, TMessage>;
}
