import { Action, Func, Context, Controller } from "localsync-core";
const mechanism = "serversync";

/**
 * Creates a mock synchronizer which uses a server safe interface equivalent to `serversync`.
 */
export const serversync = (context: Context) => {
  const createServerController = <TArgs extends any[], TMessage extends {}>(
    publisher: Func<TArgs, TMessage>,
    _subscriber: Action<[TMessage, TMessage | {}, string]>
  ): Controller => {
    let isRunning = false;

    const trigger = (...args: TArgs) => {
      context.logger.debug(`trigger(${args.join(",")}`);
      const value = publisher(...args);
      context.logger.debug(`trigger TMessage: ${value}`);
    };

    const start = () => {
      context.logger.debug("serversync#start");
      isRunning = true;
    };

    const stop = () => {
      context.logger.debug("serversync#stop");
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
      isServer: true,
      instanceID: "server"
    };
  };
  return createServerController;
};
