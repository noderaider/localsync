import storagesync from "./storagesync";
import cookiesync from "./cookiesync";
import serversync from "./serversync";

const REGEX = {
    TRIDENT_EDGE: /(Trident|Edge)/i
};

/**
 * Creates an isomorphic synchronizer to transmit objects to other tabs.
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
export default function localsync(key: string, action, handler, opts: Partial<Localsync.Opts> = {}, navigator = getNavigator()) {
    const sync = navigator === null ? serversync : isEdgeOrIE(navigator) ? cookiesync : storagesync;
    const completeOpts: Localsync.Opts = { ...getDefaultOpts(), ...opts };
    return sync(key, action, handler, completeOpts);
}

function getDefaultOpts(): Localsync.Opts {
    return {
        tracing: false,
        logger: console,
        logLevel: "info",
        idLength: 8,
        pollFrequency: 3000,
        path: "/",
        secure: false,
        httpOnly: false
    };
}

function getNavigator(): Localsync.LocalsyncNavigator {
    return typeof window === "object" && process.env.NODE_ENV !== "test" ? window.navigator : null;
}

function isEdgeOrIE(navigator): boolean {
    if (navigator === null)
        return false;
    return navigator.appName === "Microsoft Internet Explorer" || (navigator.appName === "Netscape" && REGEX.TRIDENT_EDGE.test(navigator.appVersion));
}