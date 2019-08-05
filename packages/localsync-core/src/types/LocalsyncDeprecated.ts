import { Func } from "./Func";
import { Controller } from "./Controller";
import { Action } from "./Action";

/**
 * The legacy localsync interface (deprecated).
 *
 * @remarks
 * This will be supported in this major version but deprecated in the next one.
 * A warning will be logged when using this format.
 */
export interface LocalsyncDeprecated<TArgs extends any[], TMessage> {
  (
    channel: string,
    publisher: Func<TArgs, TMessage>,
    subscriber: Action<[TMessage]>
  ): Controller;
}
