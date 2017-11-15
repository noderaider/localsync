import * as invariant from "invariant";
const mechanism = "serversync";

/**
 * Creates a mock synchronizer which uses a server safe interface equivalent to serversync
 * @param  {string}   key                       The key to synchronize on.
 * @param  {function} action                    The action to run when trigger is executed. Should return the payload to be transmitted to the handlers on other tabs.
 * @param  {function} handler                   The handler which is executed on other tabs when a synchronization is triggered. Argument is the return value of the action.
 * @param  {boolean}  [options.tracing=false]   Option to turn on tracing for debugging.
 * @param  {Object}   [options.logger=console]  The logger to debug to.
 * @param  {string}   [options.logLevel=info]   The log level to trace at.
 * @return {Object}                             serversync instance with start, stop, trigger, isRunning, and isFallback mock properties.
 */
export default function serversync(key, action, handler, { tracing = false, logger = console, logLevel = "info" } = {}) {
  invariant(key, "key is required");
  invariant(action, "action is required");
  invariant(handler, "handler is required");
  const log = (...args) => tracing ? logger[logLevel](...args) : () => {};
  let isRunning = false;

  const trigger = (...args) => {
    log("serversync#trigger", args);
    const value = action(...args);
    log("serversync#trigger action output ignored", args, value);
  };

  const start = () => {
    log("serversync#start");
    isRunning = true;
  };

  const stop = () => {
    log("serversync#stop");
    isRunning = false;
  };

  return  { start
          , stop
          , trigger
          , get isRunning () { return isRunning; }
          , mechanism
          , isFallback: false
          , isServer: true
          };
}
