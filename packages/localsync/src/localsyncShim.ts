import { Func, Action } from "localsync-core";
import { localsync } from "./localsync";

/** Translates the legacy deprecated API to the new API for backwards compatibility. */
export const localsyncShim = <TArgs extends any[], TMessage>(
  channel: string,
  publisher?: Func<TArgs, TMessage>,
  subscriber?: Action<[TMessage]>
) => {
  console.warn(
    "Use of the default export is deprecated. Use the `localsync` named export instead."
  );
  if (publisher !== undefined && subscriber !== undefined) {
    return localsync({ channel })(publisher, subscriber);
  }
  if (publisher === undefined || subscriber === undefined) {
    throw new Error("Publisher and subscriber should be defined together.");
  }
  return localsync({ channel });
};
