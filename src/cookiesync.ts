import * as invariant from "invariant";
import * as Cookies from "universal-cookie";
const mechanism = "cookiesync";

/**
 * Creates a synchronizer which uses cookie polling to transmit objects to other tabs.
 * @param  {string}   key                           The key to synchronize on.
 * @param  {function} action                        The action to run when trigger is executed. Should return the payload to be transmitted to the handlers on other tabs.
 * @param  {function} handler                       The handler which is executed on other tabs when a synchronization is triggered. Argument is the return value of the action.
 * @param  {boolean}  [options.tracing=false]       Option to turn on tracing for debugging.
 * @param  {Object}   [options.logger=console]      The logger to debug to.
 * @param  {string}   [options.logLevel=info]       The log level to trace at.
 * @param  {number}   [options.idLength=8]          The number of characters to use for unique instance ID.
 * @param  {number}   [options.pollFrequency=3000]  The frequency (in milliseconds) to poll at.
 * @param  {string}   [options.path='/']            The path to store the cookie at.
 * @param  {boolean}  [options.secure=false]        Flag to set the cookies secure flag.
 * @param  {boolean}  [options.httpOnly=false]      Flag to set the cookies httpOnly flag.
 * @return {Object}                                 cookiesync instance with start, stop, trigger, isRunning, isFallback, and instanceID properties.
 */
export default function cookiesync(key, action, handler, { tracing = false, logger = console, logLevel = "info", idLength = 8, pollFrequency = 3000, path = "/", secure = false, httpOnly = false } = {}) {
  invariant(key, "key is required");
  invariant(action, "action is required");
  invariant(handler, "handler is required");
  const cookies = new Cookies();
  const log = (...args) => tracing ? logger[logLevel](...args) : () => {};
  const cookieOpts = { path, secure, httpOnly };
  const cookieKey = `cookiesync_fallback_${key}`;
  const instanceID = (N => (Math.random().toString(36) + "00000000000000000").slice(2, N + 2))(idLength);
  const loadCookie = () => {
    try {
      const value = cookies.get(cookieKey, { doNotParse: false });
      if (typeof value !== "undefined") {
        const { instanceID, payload } = value;
        invariant(instanceID, `cookiesync cookies must have an instanceID associated => ${JSON.stringify(value)}`);
        invariant(typeof instanceID === "string" && instanceID.length === idLength, "instanceID must be a string");
        invariant(payload, `cookiesync cookies must have a payload associated => ${JSON.stringify(value)}`);
      }
      log("cookiesync#loadCookie", value);
      return value;
    } catch (err) {
      logger.error(err, `cookiesync#loadCookie => error occurred in cookiesync, wiping cookie with key ${cookieKey}`);
      cookies.remove(cookieKey);
    }
  };
  const saveCookie = (...args) => {
    invariant(args.length === 1, "should only have one argument");
    const [ payload ] = args;
    const value = { instanceID, payload };
    log("cookisync#saveCookie", instanceID, payload);
    cookies.set(cookieKey, value, cookieOpts);
  };

  let isRunning = false;
  const trigger = (...args) => {
    log("cookiesync#trigger", instanceID, ...args);
    const payload = action(...args);
    log("cookiesync#trigger => payload", payload);
    saveCookie(payload);
  };

  let intervalID = null;
  const start = (sync = false) => {
    log("cookiesync#start", instanceID);
    let last = loadCookie();
    if (!last) {
      log("cookiesync#start: nolast", instanceID);
      last = { instanceID };
      saveCookie(last);
    }
    intervalID = setInterval(function() {
      log("cookiesync#poll", instanceID);
      let current = loadCookie();
      if (!current) {
        log("cookiesync#poll: nocurrent", instanceID);
        current = last;
        saveCookie(current);
      }
      /** DONT NOTIFY IF SAME TAB */
      if (current.instanceID === instanceID) {
        log("cookiesync#poll: sameinstance", instanceID);
        return;
      }

      if (JSON.stringify(last.payload) != JSON.stringify(current.payload)) {
        log("cookiesync#poll: INVOKE|instanceID =", instanceID, "|current.instanceID =", current.instanceID, "|last.instanceID =", last.instanceID, "|last.payload =", JSON.stringify(last.payload), "|current.payload =", JSON.stringify(current.payload));
        handler(current.payload, last ? last.payload : {}, last ? (last.url || "") : "");
        last = current;
      } else {
        log("cookiesync#poll: noinvoke|instanceID =", instanceID, "|current.instanceID =", current.instanceID, "|last.instanceID =", last.instanceID, "|last.payload =", JSON.stringify(last.payload), "|current.payload =", JSON.stringify(current.payload));
      }
    }, pollFrequency);
    if (sync) {
      let current = loadCookie();
      handler(current.payload, last ? last.payload : {}, last ? (last.url || "") : "");
      last = current;
    }
    isRunning = true;
  };

  const stop = () => {
    log("cookiesync#stop", instanceID);
    clearInterval(intervalID);
    isRunning = false;
  };

  return  { start
          , stop
          , trigger
          , get isRunning () { return isRunning; }
          , mechanism
          , isFallback: true
          , isServer: false
          , instanceID
          };
}
