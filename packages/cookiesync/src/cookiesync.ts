import * as cookie from "browser-cookies";
import { Func, Action, Context, Controller } from "localsync-core";
const mechanism = "cookiesync";

const ID_LENGTH = 8;

interface CookieValue<TMessage> {
  instanceID: string;
  payload: TMessage;
  url: string;
}

/**
 * Creates a synchronizer which uses cookie polling to transmit objects to other tabs.
 */
export const cookiesync = (context: Context) => {
  const createCookieController = <TArgs extends any[], TMessage extends {}>(
    publisher: Func<TArgs, TMessage>,
    subscriber: Action<[TMessage, TMessage | {}, string]>
  ): Controller => {
    const cookieOpts = {
      path: context.options.fallback.path,
      secure: context.options.fallback.secure,
      httpOnly: context.options.fallback.httpOnly
    };
    const cookieKey = `cookiesync_fallback_${context.options.channel}`;
    const instanceID = (N =>
      (Math.random().toString(36) + "00000000000000000").slice(2, N + 2))(
      ID_LENGTH
    );
    const loadCookie = (): CookieValue<TMessage | {}> => {
      try {
        const stringValue = cookie.get(cookieKey);
        if (stringValue !== undefined && stringValue !== null) {
          const value = JSON.parse(stringValue) as CookieValue<TMessage>;
          const { instanceID, payload } = value;
          if (!instanceID) {
            throw new Error(
              `cookiesync cookies must have an instanceID associated => ${JSON.stringify(
                value
              )}`
            );
          }
          if (
            typeof instanceID !== "string" ||
            instanceID.length !== ID_LENGTH
          ) {
            throw new Error("instanceID must be a string of length 8");
          }
          if (!payload) {
            throw new Error(
              `cookiesync cookies must have a payload associated => ${JSON.stringify(
                value
              )}`
            );
          }
          context.logger.debug(`loadCookie: ${stringValue}`);
          return value;
        }
      } catch (error) {
        context.logger.error(
          `${error.message} | loadCookie => error occurred in cookiesync, wiping cookie with key ${cookieKey}`
        );
        cookie.erase(cookieKey);
      }
      return { instanceID, payload: {}, url: window.location.href };
    };
    const saveCookie = (...args: [TMessage | {}]) => {
      if (args.length !== 1) {
        throw new Error("should only have one argument");
      }
      const [payload] = args;
      const value: CookieValue<TMessage | {}> = {
        instanceID,
        payload,
        url: window.location.href
      };
      context.logger.debug(`saveCookie | ${instanceID} | ${payload}`);
      cookie.set(cookieKey, JSON.stringify(value), cookieOpts);
    };

    let isRunning = false;
    const trigger = (...args: TArgs) => {
      context.logger.debug(`trigger | ${instanceID} (${args.join(", ")})`);
      const message = publisher(...args);
      context.logger.debug(`trigger => ${message}`);
      saveCookie(message);
    };

    let intervalID: NodeJS.Timeout;
    const start = (sync = false) => {
      context.logger.debug(`start: ${instanceID}`);
      let last = loadCookie();
      if (!last) {
        context.logger.debug(`start: nolast | ${instanceID}`);
        last = { instanceID, payload: {}, url: window.location.href };
        saveCookie(last);
      }
      intervalID = setInterval(() => {
        context.logger.debug(`poll | ${instanceID}`);
        let current = loadCookie();
        if (!current) {
          context.logger.debug(`poll: nocurrent | ${instanceID}`);
          current = last;
          saveCookie(current);
        }
        /** DONT NOTIFY IF SAME TAB */
        if (current.instanceID === instanceID) {
          context.logger.debug(`poll: sameinstance | ${instanceID}`);
          return;
        }

        if (JSON.stringify(last.payload) != JSON.stringify(current.payload)) {
          context.logger.debug(`poll: INVOKE|instanceID =${instanceID}`);
          subscriber(
            current.payload as TMessage,
            last ? last.payload : {},
            last ? last.url || "" : ""
          );
          last = current;
        } else {
          context.logger.debug(`poll: NOINVOKE|instanceID =${instanceID}`);
        }
      }, context.options.fallback.pollFrequency);
      if (sync) {
        let current = loadCookie();
        subscriber(
          current.payload as TMessage,
          last ? last.payload : {},
          last ? last.url || "" : ""
        );
        last = current;
      }
      isRunning = true;
    };

    const stop = () => {
      context.logger.debug(`stop | ${instanceID}`);
      clearInterval(intervalID);
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
      isFallback: true,
      isServer: false,
      instanceID
    };
  };
  return createCookieController;
};
