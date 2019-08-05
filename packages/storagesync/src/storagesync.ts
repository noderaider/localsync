import { Func, Action, Context, Controller } from "localsync-core";
import * as ls from "local-storage";
const mechanism = "storagesync";

/**
 * Creates a synchronizer which uses localStorage 'storage' event for synchronization between tabs.
 */
export const storagesync = (context: Context) => {
  const createStorageController = <TArgs extends any[], TMessage extends {}>(
    publisher: Func<TArgs, TMessage>,
    subscriber: Action<[TMessage, TMessage | {}, string]>
  ): Controller => {
    let isRunning = false;
    let last: TMessage | {} = {};

    const trigger = (...args: TArgs) => {
      context.logger.debug(`trigger(${args.join(", ")})`);
      const value = publisher(...args);
      ls(context.options.channel, value);
    };

    const notifySubscriber = (value: TMessage) => {
      subscriber(value, last, "");
      last = value;
    };
    const start = (sync = false) => {
      context.logger.debug(`start(sync = ${sync})`);
      ls.on(context.options.channel, notifySubscriber);
      if (sync) {
        const value = ls.get(context.options.channel);
        notifySubscriber(value);
      }
      isRunning = true;
    };

    const stop = () => {
      context.logger.debug("stop()");
      ls.off(context.options.channel, notifySubscriber);
      isRunning = false;
    };

    return {
      start,
      stop,
      trigger,
      get isRunning() {
        return isRunning;
      },
      mechanism,
      isFallback: false,
      isServer: false,
      instanceID: "storage"
    };
  };
  return createStorageController;
};
