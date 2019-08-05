import {
  Func,
  Controller,
  createContext,
  Config,
  Context
} from "localsync-core";
import { serversync } from "serversync";
import { cookiesync } from "cookiesync";
import { storagesync } from "storagesync";

const getSynchronizer = (context: Context) => {
  switch (context.mechanism) {
    case "serversync":
      return serversync(context);
    case "cookiesync":
      return cookiesync(context);
    case "storagesync":
      return storagesync(context);
    default:
      throw new Error(`Unknown mechanism: ${context.mechanism}`);
  }
};

export const localsync = (config: Config) => {
  const context = createContext(config);
  const synchronizer = getSynchronizer(context);
  const createSynchronizer = <TArgs extends any[], TMessage>(
    publisher: Func<TArgs, TMessage>,
    subscriber: Func<[TMessage, TMessage | {}, string], void>
  ): Controller => {
    if (!publisher) {
      throw new Error(
        "localsync requires a publisher parameter (Func<TArgs, TMessage>).\n\tThe publisher runs when trigger is invoked and used to select data to be transmitted to other tabs."
      );
    }
    if (!subscriber) {
      throw new Error(
        "localsync requires a subscriber parameter (Func<[TMessage], void>).\n\tThe subscriber is called when a trigger occurs on another tab and is used to receive published messages from other tabs."
      );
    }

    return synchronizer(publisher, subscriber);
  };
  return createSynchronizer;
};
