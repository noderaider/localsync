import * as invariant from "invariant";
import * as ls from "local-storage";
const mechanism = "storagesync";

/**
 * Creates a synchronizer which uses localStorage 'storage' event for synchronization between tabs.
 * @param  {string}   key                       The key to synchronize on.
 * @param  {function} action                    The action to run when trigger is executed. Should return the payload to be transmitted to the handlers on other tabs.
 * @param  {function} handler                   The handler which is executed on other tabs when a synchronization is triggered. Argument is the return value of the action.
 * @param  {boolean}  [options.tracing=false]   Option to turn on tracing for debugging.
 * @param  {Object}   [options.logger=console]  The logger to debug to.
 * @param  {string}   [options.logLevel=info]   The log level to trace at.
 * @return {Object}                             storagesync instance with start, stop, trigger, isRunning, and isFallback properties.
 */
export default function storagesync(key, action, handler, { tracing = false, logger = console, logLevel = "info" } = {}) {
  invariant(key, "key is required");
  invariant(action, "action is required");
  invariant(handler, "handler is required");
  const log = (...args) => tracing ? logger[logLevel](...args) : () => {};
  let isRunning = false;
  let last = {};

  const trigger = (...args) => {
    log("storagesync#trigger", args);
    const value = action(...args);
    ls(key, value);
  };

  const start = (sync = false) => {
    log("storagesync#start");
    ls.on(key, (value) => {
      handler(value, last, "");
      last = value;
    });
    if (sync) {
      const value = ls.get(key);
      handler(value, last, "");
      last = value;
    }
    isRunning = true;
  };

  const stop = () => {
    log("storagesync#stop");
    ls.off(key, handler);
    isRunning = false;
  };

  return  { start
          , stop
          , trigger
          , get isRunning () { return isRunning; }
          , mechanism
          , isFallback: false
          , isServer: false
          };
}
