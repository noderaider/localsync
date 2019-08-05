import { Controller } from "./Controller";
import { Func } from "./Func";
import { Action } from "./Action";

/** A function that creates a synchronization controller. */
export interface CreateController<TArgs extends any[], TMessage extends {}> {
  (
    publisher: Func<TArgs, TMessage>,
    subscriber: Action<[TMessage, TMessage | {}, string]>
  ): Controller;
}
